from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.database.mongodb import evidence_collection
from app.utils.hash_utils import generate_sha256
from app.auth.roles import investigator_required
from datetime import datetime
import shutil
import os

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

    file_path = os.path.join(
        VERIFY_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    verification_hash = generate_sha256(file_path)

    original_hash = evidence["sha256"]

    is_match = verification_hash == original_hash

    verification_record = {
        "verified_at": datetime.utcnow(),
        "verified_by": current_user["user_id"],
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

            "last_verified_by": current_user["user_id"]
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
        "verification_number": history_count
    }