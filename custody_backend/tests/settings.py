"""Settings module for test app."""
from custody.settings import SQLALCHEMY_DATABASE_URI
ENV = "development"
TESTING = True
# SQLALCHEMY_DATABASE_URI = "sqlite://"
SECRET_KEY = "not-so-secret-in-tests"
BCRYPT_LOG_ROUNDS = (
    4  # For faster tests; needs at least 4 to avoid "ValueError: Invalid rounds"
)
DEBUG_TB_ENABLED = False
# CACHE_TYPE = "simple"  # Can be "memcached", "redis", etc.

CACHE_TYPE = "redis"
CACHE_REDIS_HOST = "127.0.0.1"
CACHE_REDIS_PORT = 6379
CACHE_KEY_PREFIX = 'custody'

SQLALCHEMY_TRACK_MODIFICATIONS = False
WTF_CSRF_ENABLED = False  # Allows form testing
