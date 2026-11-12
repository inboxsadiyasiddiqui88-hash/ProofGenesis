from fastapi import APIRouter, HTTPException
from datetime import datetime, UTC
from dotenv import load_dotenv
import os

from app.models.users import (
    UserRegister,
    UserLogin,
    InvestigatorRegister
)

from app.database.mongodb import users_collection
from app.auth.security import hash_password, verify_password
from app.auth.auth import create_access_token


load_dotenv()

INVESTIGATOR_REGISTRATION_CODE = os.getenv(
    "INVESTIGATOR_REGISTRATION_CODE"
)


router = APIRouter(tags=["Users"])

# -----------------------------
# User Registration
# -----------------------------
@router.post("/register")
def register(user: UserRegister):

    # Check if email already exists
    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # Hash the password
    hashed_password = hash_password(user.password)

    # Create user document
    new_user = {
    "full_name": user.full_name,
    "email": user.email,
    "password": hashed_password,
    "role": "user",
    "created_at": datetime.now(UTC)
}

    # Insert into MongoDB
    result = users_collection.insert_one(new_user)

    print("Inserted ID:", result.inserted_id)

    return {
        "message": "User registered successfully!"
    }


# -----------------------------
# Investigator Registration
# -----------------------------
@router.post("/investigator/register")
def investigator_register(
    investigator: InvestigatorRegister
):

    # Check investigator registration code
    if (
        investigator.investigator_code
        != INVESTIGATOR_REGISTRATION_CODE
    ):
        raise HTTPException(
            status_code=403,
            detail="Invalid investigator registration code."
        )

    # Check if email already exists
    existing_user = users_collection.find_one(
        {"email": investigator.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # Hash password
    hashed_password = hash_password(
        investigator.password
    )

    # Create investigator document
    new_investigator = {

        "full_name": investigator.full_name,

        "email": investigator.email,

        "password": hashed_password,

        "role": "investigator",

        "created_at": datetime.now(UTC)
    }

    # Insert into MongoDB
    result = users_collection.insert_one(
        new_investigator
    )

    print(
        "Investigator Inserted ID:",
        result.inserted_id
    )

    return {
        "message":
            "Investigator registered successfully!"
    }


# -----------------------------
# User Login
# -----------------------------
@router.post("/login")
def login(user: UserLogin):

    # Find user by email
    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    # Email not found
    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT token
    token = create_access_token({
    "user_id": str(existing_user["_id"]),
    "role": existing_user.get("role", "user")
})

    # Return token
    return {
        "access_token": token,
        "token_type": "bearer"
    }

# -----------------------------
# Reset User Password
# -----------------------------
@router.put("/reset-password")
def reset_password(email: str, new_password: str):

    # Find user
    existing_user = users_collection.find_one(
        {"email": email}
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Hash the new password
    hashed_password = hash_password(new_password)

    # Update password
    users_collection.update_one(
        {"email": email},
        {
            "$set": {
                "password": hashed_password
            }
        }
    )

    return {
        "message": "Password updated successfully"
    }