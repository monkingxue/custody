#!/usr/bin/env python
# encoding: utf-8
import argparse
import time

from custody.sys.sms import SmsInterface
from custody.login.sms_code import SmsCode
from custody.sys.util import get_redis_client, get_rq
from custody.sys.log import logger


class LoginCodeNotify:
    def __init__(self, dry_run=False):
        self.redis_client = get_redis_client()
        self.sms_code_service = SmsCode()
        self.sms_interface = SmsInterface()
        self.dry_run = dry_run

    def parse_msg(self, msg):
        code_type = None
        items = msg.split(":")
        if len(items) == 3:
            code_type = 'phone'
        elif len(items) == 2:
            code_type = 'mail'
        return code_type, items[1:]

    def send_code(self, item):
        status = 'ok'
        if not item:
            return status
        zone = item['zone']
        phone = item['phone']
        code = item['code']
        if not self.dry_run:
            status = self.sms_interface.send_code(phone, zone, code)
        else:
            status = 'ok'
        return status


def main(args):
    rq = get_rq('login_code', 'custody')
    notify = LoginCodeNotify(args.dry_run)
    while True:
        try:
            if rq.empty():
                time.sleep(3)
                continue
            item = rq.get()
            status = notify.send_code(item)
            if 'mail' in item:
                text = item['mail']
            else:
                text = '%s:%s' % (item['zone'], item['phone'])
            logger.info("send code: %s to %s, status: %s", item['code'], text, status)
        except:
            logger.exception("run fail")


def get_custom_args():
    parser = argparse.ArgumentParser(description='login code notify.')
    parser.add_argument('--dry_run', dest='dry_run', action="store_true")

    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = get_custom_args()
    main(args)
