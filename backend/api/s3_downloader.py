import boto3
import os
from dotenv import load_dotenv

load_dotenv()

# AWS S3 Bucket Configuration
BUCKET_NAME = "bruce-ai-bucket"
FILES = {
    "index.faiss": "/mnt/data/index.faiss",
    "index.pkl": "/mnt/data/index.pkl"
}

def download_files_from_s3():
    s3 = boto3.client(
    service_name = 's3',
    region_name = 'us-east-2',
    aws_access_key_id = os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key = os.environ.get('AWS_SECRET_ACCESS_KEY')
    )
    
    for s3_key, local_path in FILES.items():
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        
        if not os.path.exists(local_path):
            print(f"Downloading {s3_key} to {local_path}")
            s3.download_file(BUCKET_NAME, s3_key, local_path)
        else:
            print(f"{local_path} already exists. Skipping download.")