from fastapi import APIRouter
from app.database.mongodb import db

router = APIRouter()

@router.get("/test-db")
def test_database():
    try:
        db.command("ping")
        return {"message": "MongoDB Connected Successfully!"}
    except Exception as e:
        return {"error": str(e)}