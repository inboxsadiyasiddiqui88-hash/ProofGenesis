from fastapi import Depends, HTTPException

from app.auth.auth import verify_token


def investigator_required(
    current_user=Depends(verify_token)
):

    if current_user["role"] not in ["investigator", "admin"]:

        raise HTTPException(
            status_code=403,
            detail="Access denied. Investigator or Admin privileges required."
        )

    return current_user