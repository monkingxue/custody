import decimal
import json

import redis

from custody.settings import REDIS_CONF
from custody.sys.rq import RedisQueue

g_redis_client = None

def get_redis_client():
    global g_redis_client
    if g_redis_client is None:
        pool = redis.ConnectionPool(
            host=REDIS_CONF['host'], port=REDIS_CONF['port'],
            db=REDIS_CONF.get('db', 0),
            decode_responses=True)
        g_redis_client = redis.Redis(connection_pool=pool)
    return g_redis_client

def get_rq(name, namespace):
    return RedisQueue(name, namespace=namespace, redis_client=get_redis_client())
