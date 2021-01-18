# -*- coding: utf-8 -*-
"""Login code service."""
import re
from custody.login.sms_code import SmsCode
from custody.settings import DEV_PHONE, TEST_PHONE
from custody.error import LocalError


class VerifyCode:
    def __init__(self, identity, zone):
        self.type = None
        self.set_phone(identity)
        self.set_zone(zone)

    def set_phone(self, identity):
        identity = identity.lower().strip()
        phone_ptn = r'\d+$'
        if re.match(phone_ptn, identity):
            self.type = 'phone'
        else:
            raise LocalError('verify_code.invalid_phone', '手机号码信息不正确')
        self.phone = identity

    def set_zone(self, zone):
        zone = zone.strip()
        if self.type != 'phone':
            return
        zone_ptn = r'^\d{0,4}$'
        if re.match(zone_ptn, zone):
            self.zone = zone
            return
        raise LocalError('verify_code.invalid_zone', '暂不支持所输入的手机号码地区')

    def check_code(self, code):
        if self.type == 'phone':
            sms_service = SmsCode()
            return sms_service.check(self.phone, self.zone, code)
        else:
            raise LocalError('verify_code.invalid_type', '不支持的登录形式')

    def clear_code_wrong_count(self):
        if self.type == 'phone':
            SmsCode().clear_wrong_count(self.phone, self.zone)
        else:
            raise LocalError('verify_code.invalid_type', '不支持的登录形式')

    def set_code_wrong_count(self):
        if self.type == 'phone':
            sms_code = SmsCode()
            status = sms_code.set_wrong_count(self.phone, self.zone)
            if status == 'exceed_limit':
                sms_code.remove(self.phone, self.zone)
            return status
        else:
            raise LocalError('verify_code.invalid_type', '不支持的登录形式')

    def send_code(self, ):
        if self.type == 'phone':
            return self.send_sms_code(self.phone, self.zone)
        else:
            raise LocalError('verify_code.invalid_type', '不支持的登录形式')

    def send_sms_code(self, phone, zone):
        sms_service = SmsCode()
        test_phones = [item[0] for item in TEST_PHONE]
        if phone not in DEV_PHONE + test_phones:
            # 需要保证60s内一个手机号只能发送一次验证码
            if sms_service.is_remember(phone, zone):
                raise LocalError('verify_code.send_code_too_fast', '60秒只能申请一次手机验证码') # send code only once in one minute
            # 需要保证24小时内一个手机号最多发送20次验证码
            if sms_service.count('send', phone, zone) > 20:
                raise LocalError('verify_code.send_code_too_much', '此手机号码的验证过于频繁')
        code = sms_service.generate(phone, zone, 300, 6)
        sms_service.remember(phone, zone, 60)
        sms_service.incr('send', phone, zone)
        ttl = sms_service.ttl('send', phone, zone)
        if ttl is None or ttl == -1:
            sms_service.expire('send', phone, zone, 86400)
        return code
