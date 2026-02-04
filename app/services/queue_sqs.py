import json
from uuid import UUID
from .aws_clients import sqs_client
from ..config import settings

def get_queue_url() -> str:
    sqs = sqs_client()
    resp = sqs.get_queue_url(QueueName=settings.sqs_queue_name)
    return resp["QueueUrl"]

def enqueue_submission(submission_id: UUID) -> None:
    sqs = sqs_client()
    queue_url = get_queue_url()
    sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps({"submission_id": str(submission_id)}),
    )
