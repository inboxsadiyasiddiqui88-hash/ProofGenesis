from pydantic import BaseModel
from datetime import datetime

class EvidenceMetadata(BaseModel):
    filename: str
    file_type: str
    file_size: int
    sha256: str
    uploaded_by: str
    uploaded_at: datetime