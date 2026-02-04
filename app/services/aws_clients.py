import boto3
from . import __init__
from ..config import settings

_FAKE_CREDS = dict(
    aws_access_key_id="test",
    aws_secret_access_key="test",
)

def s3_client():
    return boto3.client(
        "s3",
        region_name=settings.aws_region,
        endpoint_url=settings.aws_endpoint_url,
        **_FAKE_CREDS,
    )

def sqs_client():
    return boto3.client(
        "sqs",
        region_name=settings.aws_region,
        endpoint_url=settings.aws_endpoint_url,
        **_FAKE_CREDS,
    )
