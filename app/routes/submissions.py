from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from uuid import uuid4, UUID

from ..db import get_db
from ..models import Submission
from ..schemas import (
    SubmissionCreate,
    SubmissionOut,
    SubmissionCreatedResponse,
    SubmissionListItem,
)
from ..services.storage_s3 import put_submission_text
from ..services.queue_sqs import enqueue_submission

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.post("", response_model=SubmissionCreatedResponse, status_code=201)
def create_submission(payload: SubmissionCreate, db: Session = Depends(get_db)):
    submission_id = uuid4()

    s3_key = put_submission_text(submission_id, payload.text)

    sub = Submission(
        id=submission_id,
        student_id=payload.student_id,
        s3_key=s3_key,
        status="PENDING",
        score=None,
    )
    db.add(sub)
    db.commit()

    enqueue_submission(submission_id)

    return SubmissionCreatedResponse(id=submission_id, status="PENDING")

@router.get("/{submission_id}", response_model=SubmissionOut)
def get_submission(submission_id: UUID, db: Session = Depends(get_db)):
    sub = db.get(Submission, submission_id)
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    return sub

@router.get("", response_model=list[SubmissionListItem])
def list_submissions(
    student_id: str = Query(..., min_length=1),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    stmt = (
        select(Submission)
        .where(Submission.student_id == student_id)
        .order_by(desc(Submission.created_at))
        .limit(limit)
    )
    rows = db.execute(stmt).scalars().all()
    return [
        SubmissionListItem(
            id=r.id,
            status=r.status,
            score=r.score,
            created_at=r.created_at,
        )
        for r in rows
    ]
