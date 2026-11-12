from fastapi import APIRouter, Depends

from app.auth.auth import (
    verify_token,
    require_user,
)

from app.auth.roles import investigator_required

from app.database.mongodb import (
    cases_collection,
    evidence_collection
)


router = APIRouter(tags=["Dashboard"])


# --------------------------------------------------
# GENERAL DASHBOARD
# --------------------------------------------------

@router.get("/dashboard")
def dashboard(current_user=Depends(verify_token)):

    user_id = current_user["user_id"]

    cases = list(
        cases_collection.find(
            {"created_by": user_id},
            {"_id": 0}
        )
    )

    evidence = list(
        evidence_collection.find(
            {"owner_id": user_id},
            {"_id": 0}
        )
    )

    return {
        "user_id": user_id,
        "total_cases": len(cases),
        "total_evidence": len(evidence),
        "cases": cases,
        "evidence": evidence
    }


# --------------------------------------------------
# USER DASHBOARD
# --------------------------------------------------

@router.get("/dashboard/user")
def user_dashboard(current_user=Depends(verify_token)):

    require_user(current_user)

    total_cases = cases_collection.count_documents(
        {
            "created_by": current_user["user_id"]
        }
    )

    total_evidence = evidence_collection.count_documents(
        {
            "owner_id": current_user["user_id"]
        }
    )

    registered = evidence_collection.count_documents(
        {
            "owner_id": current_user["user_id"],
            "blockchain_status": "Registered"
        }
    )

    pending = evidence_collection.count_documents(
        {
            "owner_id": current_user["user_id"],
            "status": "Pending User Decision"
        }
    )

    recent = evidence_collection.find(
        {
            "owner_id": current_user["user_id"]
        }
    ).sort(
        "uploaded_at",
        -1
    ).limit(5)

    recent_evidence = []

    for evidence in recent:

        recent_evidence.append(
            {
                "evidence_id": evidence.get(
                    "evidence_id"
                ),

                "case_id": evidence.get(
                    "case_id"
                ),

                "filename": evidence.get(
                    "original_filename",
                    evidence.get("filename")
                ),

                "status": evidence.get(
                    "status"
                ),

                "blockchain_status": evidence.get(
                    "blockchain_status"
                ),

                "uploaded_at": evidence.get(
                    "uploaded_at"
                )
            }
        )

    return {
        "total_cases": total_cases,
        "total_evidence": total_evidence,
        "registered_evidence": registered,
        "pending_decision": pending,
        "recent_evidence": recent_evidence
    }


# --------------------------------------------------
# INVESTIGATOR DASHBOARD
# --------------------------------------------------

@router.get("/dashboard/investigator")
def investigator_dashboard(
    current_user=Depends(verify_token)
):

    investigator_required(current_user)

    # ----------------------------------------------
    # SUMMARY COUNTS
    # ----------------------------------------------

    total_cases = cases_collection.count_documents({})

    total_evidence = evidence_collection.count_documents({})

    registered = evidence_collection.count_documents(
        {
            "blockchain_status": "Registered"
        }
    )

    pending = evidence_collection.count_documents(
        {
            "status": "Pending User Decision"
        }
    )

    cancelled = evidence_collection.count_documents(
        {
            "status": "Cancelled by User"
        }
    )

    # AI-generated evidence risk
    high_risk = evidence_collection.count_documents(
        {
            "forensic_report.authenticity_assessment.risk_level": "High"
        }
    )

    # ----------------------------------------------
    # RECENT REGISTERED EVIDENCE
    # ----------------------------------------------

    recent = evidence_collection.find(
        {
            "blockchain_status": "Registered"
        }
    ).sort(
        "uploaded_at",
        -1
    ).limit(10)

    recent_evidence = []

    for evidence in recent:

        forensic_report = evidence.get(
            "forensic_report",
            {}
        )

        authenticity_assessment = forensic_report.get(
            "authenticity_assessment",
            {}
        )

        recent_evidence.append(
            {
                "evidence_id": evidence.get(
                    "evidence_id"
                ),

                "case_id": evidence.get(
                    "case_id"
                ),

                "filename": evidence.get(
                    "original_filename",
                    evidence.get("filename")
                ),

                "status": evidence.get(
                    "status"
                ),

                "blockchain_status": evidence.get(
                    "blockchain_status"
                ),

                # AI-generated evidence risk
                "risk_level": authenticity_assessment.get(
                    "risk_level",
                    "Unknown"
                ),

                "verification_status": evidence.get(
                    "verification_status",
                    "Not Verified"
                ),

                "last_verified_at": evidence.get(
                    "last_verified_at"
                ),

                "last_verified_by_name": evidence.get(
                    "last_verified_by_name"
                ),

                "uploaded_at": evidence.get(
                    "uploaded_at"
                )
            }
        )

    # ----------------------------------------------
    # RESPONSE
    # ----------------------------------------------

    return {
        "summary": {
            "total_cases": total_cases,
            "total_evidence": total_evidence,
            "registered_evidence": registered,
            "pending_decisions": pending,
            "cancelled": cancelled,
            "high_risk_evidence": high_risk
        },

        "recent_evidence": recent_evidence
    }