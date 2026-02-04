import json
import time
from uuid import UUID

from sqlalchemy import text as sql_text
from sqlalchemy.orm import Session

from .db import SessionLocal
from .models import Submission
from .services.aws_clients import sqs_client
from .services.queue_sqs import get_queue_url
from .services.storage_s3 import get_submission_text

def compute_score(text: str) -> int:
    words = [w for w in text.split() if w.strip()]
    if not words:
        return 0
    return min(100, len(words) * 5)

def process_one_message(db: Session, message: dict) -> None:
    body = json.loads(message["Body"])
    submission_id = UUID(body["submission_id"])

    sub = db.get(Submission, submission_id)
    if not sub:
        return

    sub.status = "PROCESSING"
    db.commit()

    text_content = get_submission_text(sub.s3_key)
    sub.score = compute_score(text_content)
    sub.status = "DONE"

    db.execute(sql_text("UPDATE submissions SET updated_at = now() WHERE id = :id"), {"id": str(submission_id)})
    db.commit()

def main_loop():
    sqs = sqs_client()
    queue_url = get_queue_url()

    while True:
        resp = sqs.receive_message(
            QueueUrl=queue_url,
            MaxNumberOfMessages=1,
            WaitTimeSeconds=10,
            VisibilityTimeout=30,
        )

        msgs = resp.get("Messages", [])
        if not msgs:
            continue

        msg = msgs[0]
        receipt = msg["ReceiptHandle"]

        db = SessionLocal()
        try:
            process_one_message(db, msg)
            sqs.delete_message(QueueUrl=queue_url, ReceiptHandle=receipt)
        except Exception as e:
            print(f"[worker] error processing message: {e}")
        finally:
            db.close()

        time.sleep(0.2)

if __name__ == "__main__":
    main_loop()
