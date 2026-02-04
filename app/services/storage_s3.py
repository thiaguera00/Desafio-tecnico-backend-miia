from uuid import UUID
from .aws_clients import s3_client
from ..config import settings

def put_submission_text(submission_id: UUID, text: str) -> str:
    """
    Salva o texto no S3 (LocalStack) e retorna a key.
    """
    key = f"submissions/{submission_id}.txt"
    s3 = s3_client()
    s3.put_object(Bucket=settings.s3_bucket, Key=key, Body=text.encode("utf-8"))
    return key

def get_submission_text(s3_key: str) -> str:
    s3 = s3_client()
    obj = s3.get_object(Bucket=settings.s3_bucket, Key=s3_key)
    return obj["Body"].read().decode("utf-8")
