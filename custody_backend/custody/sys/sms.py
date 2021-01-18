#!/usr/bin/env python
# encoding: utf-8
import boto3
from qcloudsms_py import SmsSingleSender
from twilio.rest import Client as TwilioClient

from custody.settings import AWS_SNS_CONF, TWILIO_SNS_CONF, USE_TWILIO_VERIFY, CN_SNS_CONF

from custody.sys.log import logger


class SmsInterface:
    def __init__(self):
        self.client = boto3.client(
            "sns",
            aws_access_key_id=AWS_SNS_CONF['access_key'],
            aws_secret_access_key=AWS_SNS_CONF['secret_key'],
            region_name=AWS_SNS_CONF['region_name']
        )
        self.cn_client = SmsSingleSender(CN_SNS_CONF['appid'], CN_SNS_CONF['appkey'])
        account_sid = TWILIO_SNS_CONF['account_sid']
        auth_token = TWILIO_SNS_CONF['auth_token']
        self.twilio_client = TwilioClient(account_sid, auth_token)

    def send_code(self, phone, zone, code):
        content = '【aBTC平台】验证码: %s。您正在登陆智子托管，请不要将验证码泄漏给他人。智子托管工作人员不会向您索要任何账户相关信息。' % code
        if zone == '86':
            try:
                self.cn_client.send(0, zone, phone, content, extend="", ext="")
                return 'ok'
            except:
                logger.exception("send sms to +%s-%s fail", zone, phone)
                return 'fail'
        else:
            if USE_TWILIO_VERIFY:
                _verification = self.twilio_client.verify.services(
                    TWILIO_SNS_CONF['verify_service_id']).verifications.create(
                    to='+%s%s' % (zone, phone), channel='sms')
                return 'ok'
            rsp = self.client.publish(
                PhoneNumber='+%s%s' % (zone, phone),
                Message=content
            )
            if rsp['ResponseMetadata']['HTTPStatusCode'] == 200:
                return 'ok'
            else:
                logger.error("send code to +%s-%s fail, rsp %s", zone, phone, rsp)
            return 'fail'

    def send_sms(self, zone, phone, content):
        if zone == '86':
            try:
                rsp = self.cn_client.send(0, zone, phone, content, extend="", ext="")
                if rsp['result'] == 0:
                    return 'ok'
                logger.error("send sms to +%s-%s fail: %s", zone, phone, rsp)
                return 'fail'
            except:
                logger.exception("send sms to +%s-%s fail", zone, phone)
                return 'fail'
        else:
            rsp = self.client.publish(
                PhoneNumber='+%s%s' % (zone, phone),
                Message=content
            )
            if rsp['ResponseMetadata']['HTTPStatusCode'] == 200:
                return 'ok'
            else:
                logger.error("send code to +%s-%s fail, rsp %s", zone, phone, rsp)
            return 'fail'


if __name__ == '__main__':
    interface = SmsInterface()
    logger.info(interface.send_code('15986397130', '86', '123456'))
