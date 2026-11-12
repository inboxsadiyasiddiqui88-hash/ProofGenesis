from fastapi import APIRouter, Depends, HTTPException

from app.database.mongodb import users_collection

from app.auth.auth import verify_token


router = APIRouter(tags=["Profile"])


# ==========================================
# GET MY PROFILE
# ==========================================

@router.get("/profile")
def get_my_profile(
    current_user=Depends(verify_token)
):

    user_id = current_user["user_id"]


    # Find the logged-in user

    user = users_collection.find_one(
        {
            "_id": __import__("bson").ObjectId(user_id)
        }
    )


    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    return {

        "user_id":
            str(user["_id"]),

        "full_name":
            user.get("full_name", ""),

        "email":
            user.get("email", ""),

        "role":
            user.get("role", "user")

    }