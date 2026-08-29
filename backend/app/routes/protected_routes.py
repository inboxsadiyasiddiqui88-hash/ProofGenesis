from fastapi import APIRouter, Depends
from app.auth.auth import verify_token

router = APIRouter(tags=["Protected"])


@router.get("/protected")
def protected_route(user=Depends(verify_token)):
    return {
        "message": "Welcome to ProofGenesis!",
        "user": user
    }