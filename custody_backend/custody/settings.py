# -*- coding: utf-8 -*-
"""Application configuration.

Most configuration is set via environment variables.

For local development, use a .env file to set
environment variables.
"""
from environs import Env

env = Env()
env.read_env()

ENV = env.str("FLASK_ENV", default="production")
DEBUG = ENV == "development"
SQLALCHEMY_DATABASE_URI = env.str("DATABASE_URL")
SECRET_KEY = env.str("SECRET_KEY")
SEND_FILE_MAX_AGE_DEFAULT = env.int("SEND_FILE_MAX_AGE_DEFAULT")
BCRYPT_LOG_ROUNDS = env.int("BCRYPT_LOG_ROUNDS", default=13)
DEBUG_TB_ENABLED = DEBUG
DEBUG_TB_INTERCEPT_REDIRECTS = False
# CACHE_TYPE = "simple"  # Can be "memcached", "redis", etc.
CACHE_TYPE = "redis"
CACHE_REDIS_HOST = "127.0.0.1"
CACHE_REDIS_PORT = 6379
CACHE_KEY_PREFIX = 'custody'
SQLALCHEMY_TRACK_MODIFICATIONS = False

REDIS_CONF = {
    "host": "127.0.0.1",
    "port": 6379
}

ADMIN_URL = env.str('ADMIN_URL', default="")

TEST_PHONE = [('11011011011', '694375')]
DEV_PHONE = env.str('DEV_PHONE', default="").split(',')

USE_TWILIO_VERIFY = True

CN_SNS_CONF = {
    "appid": env.str("CN_SNS_APPID"),
    "appkey": env.str("CN_SNS_APPKEY")
}

TWILIO_SNS_CONF = {
    "account_sid": env.str("TWILIO_ACCOUNT_SID", default=""),
    "verify_service_id": env.str("TWILIO_VERIFY_SERVICE_ID", default=""),
    "auth_token": env.str("TWILIO_AUTH_TOKEN", default="")
}

AWS_SNS_CONF = {
    "access_key": env.str('AWS_SNS_ACCESS_KEY'),
    "secret_key": env.str('AWS_SNS_SECRET_KEY'),
    "region_name": env.str('AWS_SNS_REGION_NAME'),
    "s3_bucket_name": env.str("AWS_S3_BUCKET_NAME"),
    "s3_receipt_bucket_name": env.str("AWS_S3_RECEIPT_BUCKET_NAME"),
    "s3_audit_bucket_name": env.str("AWS_S3_AUDIT_BUCKET_NAME"),
}


