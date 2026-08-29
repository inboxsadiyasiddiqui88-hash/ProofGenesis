from fastapi import APIRouter, Depends, HTTPException

from app.auth.auth import (
    verify_token,
    require_investigator_or_admin
)

from app.database.mongodb import (
    evidence_collection,
    cases_collection
)

router = APIRouter(tags=["Forensics"])


@router.get("/forensic-report/{evidence_id}")
def forensic_report(
    evidence_id: str,
    current_user=Depends(verify_token)
):

    # Allow only Investigator/Admin
    require_investigator_or_admin(current_user)

    evidence = evidence_collection.find_one(
        {"evidence_id": evidence_id}
    )

    if not evidence:
        raise HTTPException(
            status_code=404,
            detail="Evidence not found."
        )

    case = cases_collection.find_one(
        {"case_id": evidence["case_id"]}
    )

    return {

        # ==========================
        # Case Information
        # ==========================

        "case_information": {

            "case_id": case.get("case_id"),

            "title": case.get("title"),

            "description": case.get("description")

        },

        # ==========================
        # Evidence Information
        # ==========================

        "evidence_information": {

            "evidence_id": evidence.get("evidence_id"),

            "original_filename": evidence.get("original_filename"),

            "stored_filename": evidence.get("stored_filename"),

            "file_type": evidence.get("file_type"),

            "file_size": evidence.get("file_size"),

            "uploaded_at": evidence.get("uploaded_at"),

            "storage_status": evidence.get("storage_status"),

            "storage_path": evidence.get("storage_path")

        },

        # ==========================
        # Blockchain Information
        # ==========================

        "blockchain_information": {

            "registration_status": evidence.get("blockchain_status"),

            "transaction_hash": evidence.get("blockchain_tx"),

            "block_index": evidence.get("block_index"),

            "registered_at": evidence.get("registered_at")

        },

        # ==========================
        # AI / Forensic Report
        # ==========================

        "forensic_report": evidence.get(
            "forensic_report",
            {}
        ),

        # ==========================
        # User Summary
        # ==========================

        "user_summary": evidence.get(
            "user_summary",
            {}
        ),

        # ==========================
        # Verification
        # ==========================

        "verification": {

            "current_status": evidence.get(
                "verification_status"
            ),

            "history": evidence.get(
                "verification_history",
                []
            )

        }

    }