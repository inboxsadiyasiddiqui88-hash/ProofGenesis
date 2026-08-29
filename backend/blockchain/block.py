import hashlib
import json
from datetime import datetime


class Block:

    def __init__(
        self,
        index,
        case_id,
        evidence_id,
        evidence_hash,
        previous_hash
    ):

        self.index = index

        self.timestamp = str(datetime.utcnow())

        self.case_id = case_id

        self.evidence_id = evidence_id

        self.evidence_hash = evidence_hash

        self.previous_hash = previous_hash

        self.hash = self.calculate_hash()

    def calculate_hash(self):

        block_string = json.dumps({

            "index": self.index,

            "timestamp": self.timestamp,

            "case_id": self.case_id,

            "evidence_id": self.evidence_id,

            "evidence_hash": self.evidence_hash,

            "previous_hash": self.previous_hash

        }, sort_keys=True)

        return hashlib.sha256(
            block_string.encode()
        ).hexdigest()