from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import os
import shutil
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


UPLOAD_FOLDER = "uploads"

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


    # ===============================
    # Save uploaded file
    # ===============================

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
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


        decision = {


            "status": "Metadata Analysis Complete",


            "risk_level":

                "Medium"

                if analysis.get(
                    "suspicious_findings"
                )

                else "Low",


            "reasons":

                analysis.get(

                    "suspicious_findings",

                    []

                )

        }



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
    # Check Case Exists
    # ===============================

    existing_case = cases_collection.find_one(

        {
            "case_id": case_id
        }

    )


    if not existing_case:


        raise HTTPException(

            status_code=404,

            detail="Case not found"

        )



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


        "stored_filename": None,


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