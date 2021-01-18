#!/usr/bin/env python
# encoding: utf-8
import time

from custody.data_store.customer import CustomerDataStore
from custody.error import LocalError
from custody.extensions import db
from custody.login.session import Session
from custody.models.customer import Customer, CustomerStatus
from custody.sys.log import logger


class LoginManager:
    def __init__(self, account_type, phone=None, zone=None):
        self.account_type = account_type
        self.phone = phone
        self.zone = zone
        self.sess_service = Session()
        self.new_system_user = False
        self.user_from_ref = False
        self.user_id = None

    def add_user(self):
        sess = db.session
        try:
            now = int(time.time())
            if self.account_type == "phone":
                identity = '%s-%s' % (self.zone, self.phone)
                u = Customer(identity=identity, create_time=now,
                             status=CustomerStatus.normal.value, name='')
            else:
                raise LocalError("login_manager.invalid_account_type", "手机号码出错")
            sess.add(u)
            sess.flush()
            user_id = u.id
            sess.commit()
        except:
            logger.exception("account_type=%s phone=%s zone=%s fail",
                             self.account_type, self.phone, self.zone)
            user_id = None
        return user_id

    def login(self):
        if self.account_type == 'phone':
            identity = '%s-%s' % (self.zone, self.phone)
            customer = CustomerDataStore().get(identity=identity)
        else:
            raise LocalError("login_manager.invalid_account_type", "手机号码出错")
        new_user = False
        if customer is None:
            user_id = self.add_user()
            if user_id is None:
                raise LocalError("login_manager.add_user_error", "用户注册出错")
            new_user = True
            self.new_system_user = True
        else:
            user_id = customer.id

        self.user_id = user_id

        if new_user is False:
            if customer.status != CustomerStatus.normal.value:
                raise LocalError("login_manager.invalid_customer", "此用户已被禁用")

        access_token = self.sess_service.set_user_session(user_id, ttl=86400 * 30)
        return access_token

    def logout(self, access_token):
        self.sess_service.remove(access_token)
