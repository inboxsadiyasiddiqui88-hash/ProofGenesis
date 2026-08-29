from fastapi import APIRouter, HTTPException
from datetime import datetime, UTC

from app.models.users import UserRegister, UserLogin
from app.database.mongodb import users_collection
from app.auth.security import hash_password, verify_password
from app.auth.auth import create_access_token

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
    "created_at": datetime.utcnow()
}

    # Insert into MongoDB
    result = users_collection.insert_one(new_user)

    print("Inserted ID:", result.inserted_id)

    return {
        "message": "User registered successfully!"
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