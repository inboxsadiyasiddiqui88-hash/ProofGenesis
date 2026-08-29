from fastapi import APIRouter
from app.models.case import CaseCreate

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.post("/")
async def create_case(case: CaseCreate):
    return {
        "message": "Case received successfully",
        "data": case.model_dump()
    }