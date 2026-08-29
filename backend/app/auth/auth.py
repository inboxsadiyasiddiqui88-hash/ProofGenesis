from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
import os
from fastapi import HTTPException

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

security = HTTPBearer()


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
def require_investigator_or_admin(current_user):

    if current_user["role"] not in ["investigator", "admin"]:

        raise HTTPException(

            status_code=403,

            detail="Access denied. Investigator or Admin privileges required."

        )

    return current_user

def require_user(current_user):

    if current_user["role"] != "user":
        raise HTTPException(
            status_code=403,
            detail="User access required."
        )

    return current_user

def require_admin(current_user):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required."
        )

    return current_user