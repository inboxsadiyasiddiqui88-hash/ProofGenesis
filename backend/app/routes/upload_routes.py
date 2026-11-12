from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import os
import shutil
import uuid
from datetime import datetime

from app.utils.hash_utils import generate_sha256

from app.database.mongodb import (
    evidence_collection,
    cases_collection
)

from app.auth.auth import verify_token

from app.metadata.metadata_extractor import extract_metadata

from app.analyzers.analysis_dispatcher import analyze_file

from app.ai.feature_extractor import extract_features

from app.decision.decision_engine import calculate_authenticity

from app.reports.user_summary import generate_user_summary

from app.reports.forensic_report import generate_forensic_report

from app.utils.evidence_generator import generate_evidence_id


router = APIRouter(tags=["Evidence"])
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)



@router.post("/upload/{case_id}")
async def upload_file(
    case_id: str,
    file: UploadFile = File(...),
    current_user=Depends(verify_token)
):

        # -----------------------------------------
    # Check Case Ownership
    # -----------------------------------------

    existing_case = cases_collection.find_one(
        {
            "case_id": case_id,
            "created_by": current_user["user_id"]
        }
    )

    if not existing_case:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

        # -----------------------------------------
    # File size limit
    # -----------------------------------------

    file_size = 0

    while True:
        chunk = await file.read(1024 * 1024)

        if not chunk:
            break

        file_size += len(chunk)

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail="File size exceeds the 50 MB limit."
            )

    await file.seek(0)


    # ===============================
    # Save uploaded file
    # ===============================

  # Generate a short, safe filename for storage
    file_extension = os.path.splitext(
      file.filename
)[1]
    stored_filename = (
        str(uuid.uuid4()) +
        file_extension
)
    file_path = os.path.join(
        UPLOAD_FOLDER,
        stored_filename
)


    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )



    # ===============================
    # Generate SHA256 Hash
    # ===============================

    file_hash = generate_sha256(
        file_path
    )



    # ===============================
    # Extract Metadata
    # ===============================

    metadata = extract_metadata(
        file_path
    )



    # ===============================
    # File Analysis
    # ===============================

    file_category, analysis = analyze_file(
        file_path
    )



    # ===============================
    # AI ANALYSIS DECISION
    # ===============================


    if file_category == "image":

     deep_features = extract_features(
        file_path
    )

     decision = calculate_authenticity(
        metadata,
        analysis,
        deep_features
    )

    else:

     decision = calculate_authenticity(
        metadata,
        analysis
    )


    # ===============================
    # Generate Reports
    # ===============================


    user_summary = generate_user_summary(
    analysis.get("analysis_type", "Image"),
    decision,
    analysis
)

    forensic_report = generate_forensic_report(

        metadata,

        analysis,

        decision

    )



    # ===============================
    # Current User
    # ===============================

    owner_id = current_user["user_id"]



    # ===============================
    # Generate Evidence ID
    # ===============================

    evidence_id = generate_evidence_id()



    # ===============================
    # Evidence Document
    # ===============================


    evidence = {


        "evidence_id": evidence_id,


        "case_id": case_id,


        "owner_id": owner_id,


        "original_filename": file.filename,


        "stored_filename": stored_filename,


        "filepath": file_path,


        "file_type": file.content_type,


        "file_size": os.path.getsize(
            file_path
        ),


        "sha256": file_hash,


        "uploaded_at": datetime.utcnow(),



        # Status

        "status": "Pending User Decision",


        "verification_status": "Not Verified",


        "blockchain_status": "Not Registered",



        # Storage

        "storage_status": "Temporary",


        "storage_path": file_path,



        # User readable report

        "user_summary": user_summary,



        # Investigator report

        "forensic_report": forensic_report,



        # Blockchain

        "blockchain_tx": None


    }



    # ===============================
    # Save MongoDB
    # ===============================


    evidence_collection.insert_one(
        evidence
    )



    # ===============================
    # API Response
    # ===============================


    return {

    "message": "AI analysis completed successfully!",

    "evidence_id": evidence_id,

    "filename": file.filename,

    "file_category": file_category,

    "status": "Pending User Decision",

    "summary": user_summary

}



@router.get("/my-evidence")
def get_my_evidence(
    current_user=Depends(verify_token)
):

    owner_id = current_user["user_id"]

    evidence_list = list(
        evidence_collection.find(
            {"owner_id": owner_id},
            {
                "_id": 0,
                "evidence_id": 1,
                "case_id": 1,
                "original_filename": 1,
                "uploaded_at": 1,
                "status": 1,
                "blockchain_status": 1,
                "user_summary": 1
            }
        ).sort(
            "uploaded_at",
            -1
        )
    )

    return {
        "evidence": evidence_list
    }

@router.get("/evidence/{evidence_id}")
def get_evidence_details(
    evidence_id: str,
    current_user=Depends(verify_token)
):

    owner_id = current_user["user_id"]

    evidence = evidence_collection.find_one(
        {
            "evidence_id": evidence_id,
            "owner_id": owner_id
        },
        {
            "_id": 0,
            "evidence_id": 1,
            "case_id": 1,
            "original_filename": 1,
            "file_type": 1,
            "file_size": 1,
            "sha256": 1,
            "uploaded_at": 1,
            "status": 1,
            "verification_status": 1,
            "blockchain_status": 1,
            "blockchain_tx": 1,
            "user_summary": 1
        }
    )

    if not evidence:

        raise HTTPException(
            status_code=404,
            detail="Evidence not found"
        )

    return evidence