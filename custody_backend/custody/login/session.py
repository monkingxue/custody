#!/usr/bin/env python
# encoding: utf-8
import uuid
import hashlib
import time
import json

from custody.sys.util import get_redis_client


class Session:
    def __init__(self, ):
        self.redis_client = get_redis_client()

    def remove(self, access_token):
        key = 'token:%s' % access_token
        self.redis_client.delete(key)

    def fetch(self, access_token):
        key = 'token:%s' % access_token
        session_data = self.redis_client.get(key)
        if session_data:
            return json.loads(session_data)
        return None

    def generate_access_token(self, user_id):
        uniqid = str(uuid.uuid4())
        m = hashlib.md5()
        s = '%s%s' % (user_id, uniqid)
        m.update(s.encode('utf8'))
        return m.hexdigest()

    def set_last_login(self, user_session, ttl=86400 * 7):
        k = 'last_login:%s:%s:%s' % (user_session['role'], user_session['user_id'], user_session['token_id'])
        self.redis_client.set(k, int(time.time()))
        if ttl > 0:
            self.redis_client.expire(k, ttl)

    def get_last_login(self, user_id, token_id, role='user'):
        k = 'last_login:%s:%s:%s' % (role, user_id, token_id)
        data = self.redis_client.get(k)
        if data:
            return int(data)
        return None

    def set_user_session(self, user_id, remember=1, ttl=86400 * 7, role='user'):
        now = int(time.time())
        access_token = self.generate_access_token(user_id)
        session_data = json.dumps({
            'user_id': user_id,
            'role': role,
            'remember': remember,
            '@': ttl,
            'created': now
            })
        key = 'token:%s' % access_token
        self.redis_client.set(key, session_data)
        if ttl > 0:
            self.redis_client.expire(key, ttl)
        return access_token
