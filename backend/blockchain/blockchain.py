import json
import os
import hashlib

from blockchain.block import Block


class Blockchain:

    def __init__(self):

        self.chain = []

        self.file_path = "blockchain/blockchain.json"

        self.load_chain()

    # -----------------------------
    # Load existing blockchain
    # -----------------------------
    def load_chain(self):

        if os.path.exists(self.file_path):

            with open(self.file_path, "r") as file:

                data = json.load(file)

            if len(data) > 0:

                self.chain = data

            else:

                self.create_genesis_block()

        else:

            self.create_genesis_block()

    # -----------------------------
    # Create Genesis Block
    # -----------------------------
    def create_genesis_block(self):

        genesis = Block(

            index=0,

            case_id="GENESIS",

            evidence_id="GENESIS",

            evidence_hash="0",

            previous_hash="0"
        )

        self.chain = [genesis.__dict__]

        self.save_chain()

    # -----------------------------
    # Save blockchain
    # -----------------------------
    def save_chain(self):

        with open(self.file_path, "w") as file:

            json.dump(self.chain, file, indent=4)

    # -----------------------------
    # Add Block
    # -----------------------------
    def add_block(
        self,
        case_id,
        evidence_id,
        evidence_hash
    ):

        previous_block = self.chain[-1]

        new_block = Block(

            index=len(self.chain),

            case_id=case_id,

            evidence_id=evidence_id,

            evidence_hash=evidence_hash,

            previous_hash=previous_block["hash"]
        )

        self.chain.append(new_block.__dict__)

        self.save_chain()

        return new_block.__dict__

    # -----------------------------
    # Validate Blockchain
    # -----------------------------
    def is_chain_valid(self):

        for i in range(1, len(self.chain)):

            current_block = self.chain[i]

            previous_block = self.chain[i - 1]

            # -----------------------------
            # Check previous hash connection
            # -----------------------------
            if current_block.get("previous_hash") != previous_block.get("hash"):

                return False

            # -----------------------------
            # Check required fields
            # -----------------------------
            required_fields = [
                "index",
                "timestamp",
                "case_id",
                "evidence_hash",
                "previous_hash",
                "hash"
            ]

            for field in required_fields:

                if field not in current_block:

                    return False

            # -----------------------------
            # Recalculate hash
            # -----------------------------
            block_data = {

                "index": current_block["index"],

                "timestamp": current_block["timestamp"],

                "case_id": current_block["case_id"],

                "evidence_hash": current_block["evidence_hash"],

                "previous_hash": current_block["previous_hash"]
            }

            # New blocks contain evidence_id.
            # Old blocks may not contain it.
            if "evidence_id" in current_block:

                block_data["evidence_id"] = current_block["evidence_id"]

            block_string = json.dumps(
                block_data,
                sort_keys=True
            )

            calculated_hash = hashlib.sha256(
                block_string.encode()
            ).hexdigest()

            # -----------------------------
            # Check current block hash
            # -----------------------------
            if current_block["hash"] != calculated_hash:

                return False

        return True