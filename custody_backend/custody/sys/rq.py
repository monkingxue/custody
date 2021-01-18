#!/usr/bin/env python
# encoding: utf-8
import json
import redis

class RedisQueue(object):
    """Simple Queue with Redis Backend"""
    def __init__(self, name, namespace='queue', redis_client=None, **redis_kwargs):
        """The default connection parameters are: host='localhost', port=6379, db=0"""
        if redis_client is None:
            redis_client = redis.Redis(**redis_kwargs)
        self.__db= redis_client
        self.key = '%s:%s' %(namespace, name)

    def qsize(self):
        """Return the approximate size of the queue."""
        return self.__db.llen(self.key)

    def empty(self):
        """Return True if the queue is empty, False otherwise."""
        return self.qsize() == 0

    def put(self, item):
        """Put item into the queue."""
        self.__db.rpush(self.key, json.dumps(item))

    def get(self, block=True, timeout=None):
        """Remove and return an item from the queue. 

        If optional args block is true and timeout is None (the default), block
        if necessary until an item is available."""
        if block:
            item = self.__db.blpop(self.key, timeout=timeout)
        else:
            item = self.__db.lpop(self.key)

        if item:
            item = json.loads(item[1])
        return item

    def get_nowait(self):
        """Equivalent to get(False)."""
        return self.get(False)

if __name__ == '__main__':
    from custody.settings import REDIS_CONF
    q = RedisQueue('test_queue', 'custody', host=REDIS_CONF['host'], port=REDIS_CONF['port'])
    q.put({"type": "update_price", "page": 0})
    print("empty: %s" % q.empty())
    item = q.get()
    print(item)
