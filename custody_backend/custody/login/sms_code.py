# -*- coding: utf-8 -*-
import random

from custody.settings import TEST_PHONE, USE_TWILIO_VERIFY, TWILIO_SNS_CONF

from twilio.rest import Client as TwilioClient

from custody.sys.log import logger
from custody.sys.util import get_redis_client, get_rq


class SmsCode:
    def __init__(self, ):
        self.redis_client = get_redis_client()
        self.rq = get_rq('login_code', 'custody')

    def generate(self, phone, zone, ttl=180, length=6):
        ch = '0123456789'
        code = ''.join([random.choice(ch) for _ in range(length)])
        is_test_phone = False
        for item in TEST_PHONE:
            if phone == item[0]:
                code, is_test_phone = item[1], True
                break
        k = 'code:%s:%s' % (zone, phone)
        if ttl > 0:
            self.redis_client.set(k, code, ttl)
            if not is_test_phone:
                self.rq.put({"code": code, "zone": zone, "phone": phone})
        return code

    def check(self, phone, zone, code):
        if USE_TWILIO_VERIFY and zone != '86':
            account_sid = TWILIO_SNS_CONF['account_sid']
            auth_token = TWILIO_SNS_CONF['auth_token']
            twilio_client = TwilioClient(account_sid, auth_token)
            try:
                _verification = twilio_client.verify.services(TWILIO_SNS_CONF['verify_service_id']).verification_checks.create(
                        to='+%s%s' % (zone, phone), code=code)
                valid = _verification.valid
            except:
                logger.exception("verify fail")
                valid = False
            return valid
        for item in TEST_PHONE:
            if phone == item[0] and code == item[1]:
                return True
        key = 'code:%s:%s' % (zone, phone)
        stored_code = self.redis_client.get(key)
        return (stored_code == code)

    def set_wrong_count(self, phone, zone, ttl=300):
        key = 'code:%s:%s:wrong_count' % (zone, phone)
        data = self.redis_client.get(key)
        if data is None:
            self.redis_client.setex(key, ttl, 1)
            return 'inc'
        if int(data) > 5:
            return 'exceed_limit'
        self.redis_client.incr(key)
        return 'inc'

    def clear_wrong_count(self, phone, zone):
        key = 'code:%s:%s:wrong_count' % (zone, phone)
        self.redis_client.delete(key)

    def remember(self, phone, zone, ttl=60):
        key = 'remember:%s:%s' % (zone, phone)
        self.redis_client.set(key, 1)
        if ttl > 0:
            self.redis_client.expire(key, ttl)
        return key

    def remove(self, phone, zone):
        key = 'code:%s:%s' % (zone, phone)
        self.redis_client.delete(key)

    def is_remember(self, phone, zone):
        key = 'remember:%s:%s' % (zone, phone)
        return self.redis_client.exists(key)

    def ttl(self, action, phone, zone):
        key = '%s:%s:%s' % (action, zone, phone)
        return self.redis_client.ttl(key)

    def incr(self, action, phone, zone):
        key = '%s:%s:%s' % (action, zone, phone)
        return self.redis_client.incr(key)

    def expire(self, action, phone, zone, ttl):
        key = '%s:%s:%s' % (action, zone, phone)
        return self.redis_client.expire(key, ttl)

    def count(self, action, phone, zone):
        key = '%s:%s:%s' % (action, zone, phone)
        val = self.redis_client.get(key)
        return (0 if val is None else int(val))
