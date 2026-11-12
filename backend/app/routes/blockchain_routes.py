from fastapi import APIRouter, HTTPException, Depends
from blockchain.blockchain import Blockchain
from app.database.mongodb import evidence_collection
from datetime import datetime
import os
import shutil

from app.auth.auth import verify_token
from app.auth.roles import investigator_required


TEMP_FOLDER = "uploads"
PERMANENT_FOLDER = "evidence_storage"

os.makedirs(PERMANENT_FOLDER, exist_ok=True)


blockchain = Blockchain()

router = APIRouter(tags=["Blockchain"])


# =====================================================
# Proceed Evidence Registration to Blockchain
# =====================================================

@router.post("/evidence/{evidence_id}/proceed")
def proceed_to_blockchain(
    evidence_id: str,
    current_user=Depends(verify_token)
):

    # Find evidence belonging to the logged-in user
    evidence = evidence_collection.find_one(
        {
            "evidence_id": evidence_id,
            "owner_id": current_user["user_id"]
        }
    )

    if not evidence:
        raise HTTPException(
            status_code=404,
            detail="Evidence not found."
        )

    # Prevent duplicate blockchain registration
    if evidence.get("blockchain_status") == "Registered":
        raise HTTPException(
            status_code=400,
            detail="Evidence already registered on blockchain."
        )

    # -----------------------------------------
    # Prepare permanent storage
    # -----------------------------------------

    extension = os.path.splitext(
        evidence["original_filename"]
    )[1]

    stored_filename = (
        evidence["evidence_id"] + extension
    )

    old_path = evidence["filepath"]

    new_path = os.path.join(
        PERMANENT_FOLDER,
        stored_filename
    )

    # Make sure the temporary evidence exists
    # BEFORE registering it on the blockchain
    if not os.path.exists(old_path):
        raise HTTPException(
            status_code=404,
            detail="Evidence file not found in temporary storage."
        )

    # -----------------------------------------
    # Add evidence to blockchain
    # -----------------------------------------

    new_block = blockchain.add_block(
        case_id=evidence["case_id"],
        evidence_id=evidence["evidence_id"],
        evidence_hash=evidence["sha256"]
    )

    # -----------------------------------------
    # Move file to permanent storage
    # -----------------------------------------

    shutil.move(
        old_path,
        new_path
    )

    # -----------------------------------------
    # Update MongoDB document
    # -----------------------------------------

    evidence_collection.update_one(
        {
            "evidence_id": evidence_id
        },
        {
            "$set": {
                "status": "Registered",
                "blockchain_status": "Registered",
                "blockchain_tx": new_block["hash"],
                "block_index": new_block["index"],
                "registered_at": datetime.utcnow(),
                "storage_status": "Permanent",
                "storage_path": new_path,
                "stored_filename": stored_filename
            }
        }
    )

    return {
        "message": "Evidence successfully protected.",
        "case_id": evidence["case_id"],
        "evidence_id": evidence["evidence_id"],
        "block_index": new_block["index"],
        "registration_status": "Registered"
    }


# =====================================================
# Cancel Blockchain Registration
# =====================================================

@router.post("/evidence/{evidence_id}/cancel")
def cancel_registration(
    evidence_id: str,
    current_user=Depends(verify_token)
):

    evidence = evidence_collection.find_one(
        {
            "evidence_id": evidence_id,
            "owner_id": current_user["user_id"]
        }
    )

    if not evidence:
        raise HTTPException(
            status_code=404,
            detail="Evidence not found."
        )

    if evidence.get("blockchain_status") == "Registered":
        raise HTTPException(
            status_code=400,
            detail="Evidence has already been registered."
        )

    evidence_collection.update_one(
        {
            "evidence_id": evidence_id
        },
        {
            "$set": {
                "status": "Cancelled by User"
            }
        }
    )

    return {
        "message": "Blockchain registration cancelled."
    }


# =====================================================
# Validate Blockchain
# Investigator Only
# =====================================================

@router.get("/blockchain/validate")
def validate_blockchain(
    current_user=Depends(investigator_required)
):

    is_valid = blockchain.is_chain_valid()

    if is_valid:
        return {
            "valid": True,
            "message": "Blockchain is valid and has not been tampered with."
        }

    return {
        "valid": False,
        "message": "Blockchain integrity compromised. Tampering detected."
    }


# =====================================================
# Get Blockchain Evidence
# Investigator Only
# =====================================================

@router.get("/blockchain/evidence/{evidence_id}")
def get_blockchain_evidence(
    evidence_id: str,
    current_user=Depends(investigator_required)
):

    for block in blockchain.chain:

        if block.get("evidence_id") == evidence_id:

            return {
                "found": True,
                "block": block
            }

    raise HTTPException(
        status_code=404,
        detail="Evidence not found on blockchain."
    )