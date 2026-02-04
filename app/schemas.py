from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional
from datetime import datetime

class SubmissionCreate(BaseModel):
    student_id: str = Field(min_length=1, max_length=200)
    text: str = Field(min_length=1, max_length=200_000)

class SubmissionOut(BaseModel):
    id: UUID
    student_id: str
    s3_key: str
    status: str
    score: Optional[int] = None
    created_at: datetime
    updated_at: datetime

class SubmissionCreatedResponse(BaseModel):
    id: UUID
    status: str

class SubmissionListItem(BaseModel):
    id: UUID
    status: str
    score: Optional[int] = None
    created_at: datetime
