from pydantic import BaseModel, Field
from typing import Optional

class CaseCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None
    priority: str = "Normal"