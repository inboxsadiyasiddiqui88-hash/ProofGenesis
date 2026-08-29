from fastapi import APIRouter, Depends

from app.auth.auth import (
    verify_token,
    require_user,
    require_investigator_or_admin,
    require_admin
)

from app.database.mongodb import (
    cases_collection,
    users_collection,
    evidence_collection
)

router = APIRouter(tags=["Dashboard"])


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

        recent_evidence.append({

            "evidence_id": evidence.get("evidence_id"),
            "case_id": evidence.get("case_id"),
            "filename": evidence.get("original_filename", evidence.get("filename")),
            "status": evidence.get("status"),
            "blockchain_status": evidence.get("blockchain_status"),
            "uploaded_at": evidence.get("uploaded_at")

        })

    return {

        "total_cases": total_cases,
        "total_evidence": total_evidence,
        "registered_evidence": registered,
        "pending_decision": pending,
        "recent_evidence": recent_evidence

    }


@router.get("/dashboard/investigator")
def investigator_dashboard(current_user=Depends(verify_token)):

    require_investigator_or_admin(current_user)

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

    high_risk = evidence_collection.count_documents(
        {
            "ai_report.risk_level": "High"
        }
    )

    recent = evidence_collection.find().sort(
        "uploaded_at",
        -1
    ).limit(10)

    recent_evidence = []

    for evidence in recent:

        recent_evidence.append({

            "evidence_id": evidence.get("evidence_id"),
            "case_id": evidence.get("case_id"),
            "filename": evidence.get("original_filename", evidence.get("filename")),
            "status": evidence.get("status"),
            "blockchain_status": evidence.get("blockchain_status"),
            "uploaded_at": evidence.get("uploaded_at")

        })

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


@router.get("/dashboard/admin")
def admin_dashboard(current_user=Depends(verify_token)):

    require_admin(current_user)

    # User Statistics
    total_users = users_collection.count_documents({})

    total_investigators = users_collection.count_documents(
        {
            "role": "investigator"
        }
    )

    total_admins = users_collection.count_documents(
        {
            "role": "admin"
        }
    )

    # System Statistics
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

    # AI Statistics
    high_risk = evidence_collection.count_documents(
        {
            "ai_report.risk_level": "High"
        }
    )

    low_risk = evidence_collection.count_documents(
        {
            "ai_report.risk_level": "Low"
        }
    )

    return {

        "users": {

            "total_users": total_users,
            "investigators": total_investigators,
            "admins": total_admins

        },

        "system": {

            "cases": total_cases,
            "evidence": total_evidence,
            "registered": registered,
            "pending": pending,
            "cancelled": cancelled

        },

        "ai": {

            "high_risk": high_risk,
            "low_risk": low_risk

        }

    }