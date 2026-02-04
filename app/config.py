from pydantic import BaseModel
import os

class Settings(BaseModel):
    database_url: str = os.getenv("DATABASE_URL")
    aws_endpoint_url: str = os.getenv("AWS_ENDPOINT_URL")
    aws_region: str = os.getenv("AWS_REGION")
    s3_bucket: str = os.getenv("S3_BUCKET")
    sqs_queue_name: str = os.getenv("SQS_QUEUE_NAME")

settings = Settings()
