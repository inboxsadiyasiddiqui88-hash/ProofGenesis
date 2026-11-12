
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime

from app.models.case import CaseCreate
from app.database.mongodb import (cases_collection, evidence_collection)
from app.auth.auth import verify_token
from app.utils.case_generator import generate_case_id


router = APIRouter(tags=["Cases"])


# ==========================================
# CREATE CASE
# ==========================================

@router.post("/cases")
def create_case(
    case: CaseCreate,
    current_user=Depends(verify_token)
):

    new_case = {

        "case_id": generate_case_id(),

        "title": case.title,

        "description": case.description,

        "created_by": current_user["user_id"],

        "created_at": datetime.utcnow(),

        "status": "Open",

        "priority": case.priority
    }


    result = cases_collection.insert_one(
        new_case
    )


    return {

        "message":
            "Case created successfully!",

        "case_db_id":
            str(result.inserted_id),

        "case_id":
            new_case["case_id"]

    }


# ==========================================
# GET MY CASES
# ==========================================

@router.get("/cases/my-cases")
def get_my_cases(
    current_user=Depends(verify_token)
):

    user_id = current_user["user_id"]


    cases = cases_collection.find(
        {
            "created_by": user_id
        }
    ).sort(
        "created_at",
        -1
    )


    result = []


    for case in cases:

        result.append({

            "case_id":
                case["case_id"],

            "title":
                case["title"],

            "description":
                case.get(
                    "description"
                ),

            "priority":
                case.get(
                    "priority",
                    "Normal"
                ),

            "status":
                case.get(
                    "status",
                    "Open"
                ),

            "created_at":
                case["created_at"]

        })


    return {

        "cases": result

    }


# ==========================================
# GET CASE DETAILS
# ==========================================

@router.get("/cases/{case_id}")
def get_case_details(
    case_id: str,
    current_user=Depends(verify_token)
):

    user_id = current_user["user_id"]


    # Find the case only if it belongs
    # to the currently logged-in user

    case = cases_collection.find_one(
        {
            "case_id": case_id,
            "created_by": user_id
        }
    )


    # Case not found or does not belong
    # to the logged-in user

    if not case:

        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )


    return {

        "case_id":
            case["case_id"],

        "title":
            case["title"],

        "description":
            case.get(
                "description"
            ),

        "priority":
            case.get(
                "priority",
                "Normal"
            ),

        "status":
            case.get(
                "status",
                "Open"
            ),

        "created_at":
            case["created_at"]

    }

@router.get("/cases/{case_id}/evidence")
def get_case_evidence(
    case_id: str,
    current_user=Depends(verify_token)
):

    user_id = current_user["user_id"]

    # First check that this case belongs to the logged-in user
    case = cases_collection.find_one(
        {
            "case_id": case_id,
            "created_by": user_id
        }
    )

    if not case:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    # Find evidence belonging to this case
    evidence = evidence_collection.find(
        {
            "case_id": case_id,
            "owner_id": user_id
        }
    ).sort(
        "uploaded_at",
        -1
    )

    result = []

    for item in evidence:

        result.append({

            "evidence_id": item["evidence_id"],

            "original_filename":
                item.get("original_filename"),

            "uploaded_at":
                item.get("uploaded_at"),

            "status":
                item.get("status"),

            "blockchain_status":
                item.get("blockchain_status"),

            "verification_status":
                item.get("verification_status")

        })

    return {
        "evidence": result
    }