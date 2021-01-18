# -*- coding: utf-8 -*-

from custody.login.session import Session


def init_user_login():
    test_user_id = 1
    session_interface = Session()
    access_token = session_interface.set_user_session(
        user_id=test_user_id, role='user')
    return access_token
