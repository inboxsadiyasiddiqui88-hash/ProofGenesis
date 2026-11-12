from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.database.mongodb import evidence_collection, users_collection
from app.utils.hash_utils import generate_sha256
from app.auth.roles import investigator_required
from bson import ObjectId
from datetime import datetime
import shutil
import os
import uuid

router = APIRouter(tags=["Verification"])

VERIFY_FOLDER = "verification_uploads"
os.makedirs(VERIFY_FOLDER, exist_ok=True)


@router.post("/evidence/{evidence_id}/verify")
async def verify_evidence(
    evidence_id: str,
    file: UploadFile = File(...),
    current_user=Depends(investigator_required)
):

    evidence = evidence_collection.find_one(
        {"evidence_id": evidence_id}
    )

    if not evidence:
        raise HTTPException(
            status_code=404,
            detail="Evidence not found."
        )

    if evidence["blockchain_status"] != "Registered":
        raise HTTPException(
            status_code=400,
            detail="This evidence has not been registered on the blockchain."
        )

    safe_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(VERIFY_FOLDER, safe_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    verification_hash = generate_sha256(file_path)

    # Remove temporary verification file after hashing
    if os.path.exists(file_path):
        os.remove(file_path)

    original_hash = evidence["sha256"]

    is_match = verification_hash == original_hash
    # Get investigator details
    investigator = users_collection.find_one(
        {"_id": ObjectId(current_user["user_id"])}
    )

    investigator_name = (
        investigator.get("full_name", "Unknown Investigator")
        if investigator
        else "Unknown Investigator" 
    )

    verification_record = {
        "verified_at": datetime.utcnow(),
        "verified_by": current_user["user_id"],
        "verified_by_name": investigator_name,
        "verification_result": "Verified" if is_match else "Tampered",
        "integrity": "Verified" if is_match else "Failed",
        "uploaded_hash": verification_hash
    }

    evidence_collection.update_one(
    {"evidence_id": evidence_id},
    {
        "$push": {
            "verification_history": verification_record
        },
        "$set": {
            "verification_status":
                "Verified" if is_match else "Integrity Failed",
            "last_verified_at": datetime.utcnow(),
            "last_verified_by":
                current_user["user_id"],
            "last_verified_by_name":
                investigator_name
        }
    }
)

    history_count = len(
        evidence.get("verification_history", [])
    ) + 1

    return {
    "evidence_id": evidence["evidence_id"],
    "case_id": evidence["case_id"],
    "verification_result": "Verified" if is_match else "Tampered",
    "integrity": "Verified" if is_match else "Failed",
    "verified_by": current_user["user_id"],
    "verified_by_name": investigator_name,
    "verification_number": history_count
}