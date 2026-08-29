from fastapi import APIRouter, Depends
from datetime import datetime

from app.models.case import CaseCreate
from app.database.mongodb import cases_collection
from app.auth.auth import verify_token
from app.utils.case_generator import generate_case_id

router = APIRouter(tags=["Cases"])

@router.post("/cases")
def create_case(
    case: CaseCreate,
    current_user=Depends(verify_token)
):

    new_case = {
        "case_id": generate_case_id(),   # We'll replace this in Lesson 3

        "title": case.title,

        "description": case.description,

        "created_by": current_user["user_id"],

        "created_at": datetime.utcnow(),

        "status": "Open",

        "priority": case.priority
    }

    result = cases_collection.insert_one(new_case)

    return {
        "message": "Case created successfully!",
        "case_db_id": str(result.inserted_id),
        "case_id": new_case["case_id"]
    }