from fastapi import Depends, HTTPException
from app.auth.auth import verify_token


# --------------------------------------------------
# INVESTIGATOR-ONLY ACCESS
# --------------------------------------------------

def investigator_required(
    current_user=Depends(verify_token)
):
    if current_user["role"] != "investigator":
        raise HTTPException(
            status_code=403,
            detail="Investigator access required."
        )

    return current_user