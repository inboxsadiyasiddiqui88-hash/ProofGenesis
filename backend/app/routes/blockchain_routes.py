from fastapi import APIRouter, HTTPException
from blockchain.blockchain import Blockchain
from app.database.mongodb import evidence_collection
from datetime import datetime
import os
import shutil


TEMP_FOLDER = "uploads"
PERMANENT_FOLDER = "evidence_storage"

os.makedirs(PERMANENT_FOLDER, exist_ok=True)


blockchain = Blockchain()

router = APIRouter(tags=["Blockchain"])


# =====================================================
# Proceed Evidence Registration to Blockchain
# =====================================================

@router.post("/evidence/{evidence_id}/proceed")
def proceed_to_blockchain(evidence_id: str):

    # Find evidence using ProofGenesis Evidence ID
    evidence = evidence_collection.find_one(
        {"evidence_id": evidence_id}
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

    extension = os.path.splitext(
        evidence["original_filename"]
    )[1]


    stored_filename = (
        evidence["evidence_id"] + extension
    )


    old_path = os.path.join(
        TEMP_FOLDER,
        evidence["original_filename"]
    )


    new_path = os.path.join(
        PERMANENT_FOLDER,
        stored_filename
    )


    if not os.path.exists(old_path):
     raise HTTPException(
        status_code=404,
        detail="Evidence file not found in temporary storage."
    )

    shutil.move(old_path, new_path)


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

        "message":
        "Evidence successfully protected.",

        "case_id":
        evidence["case_id"],

        "evidence_id":
        evidence["evidence_id"],

        "block_index":
        new_block["index"],

        "registration_status":
        "Registered"

    }



# =====================================================
# Cancel Blockchain Registration
# =====================================================

@router.post("/evidence/{evidence_id}/cancel")
def cancel_registration(evidence_id: str):


    evidence = evidence_collection.find_one(

        {
            "evidence_id": evidence_id
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

                "status":
                "Cancelled by User"

            }

        }

    )


    return {

        "message":
        "Blockchain registration cancelled."

    }