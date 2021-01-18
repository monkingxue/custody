# -*- coding: utf-8 -*-
"""Customer login views."""
import json

from flask import Blueprint, request, g, flash

from custody.login.verify_code import VerifyCode
from custody.error import LocalError, get_error_response
from custody.login.manager import LoginManager
from custody.settings import DEBUG


blueprint = Blueprint('customer_login', __name__)


@blueprint.route('/customer/login', methods=['POST'])
def login():
    """Customer login."""
    params = json.loads(request.data)
    zone = params.get('zone')
    phone = params.get('phone')
    code = params.get('code')
    
    try:
        login_code_service = VerifyCode(phone, zone)
    except LocalError as err:
        return get_error_response(err)
    code_ok = login_code_service.check_code(code)
    if not code_ok:
        try:
            _ = login_code_service.set_code_wrong_count()
        except LocalError as err:
            return get_error_response(err)
        return json.dumps({
            "status": "fail",
            "error": {"code": "10008", "message": "手机验证码不正确"}
            })
    login_code_service.clear_code_wrong_count()
    if login_code_service.type == 'phone':
        manager = LoginManager('phone', phone=phone, zone=zone)
    else:
        return json.dumps({
            "status": "fail",
            "error": {"code": "10008", "message": "不支持的登录形式"}
        })
    try:
        access_token = manager.login()
    except LocalError as err:
        return get_error_response(err)

    return json.dumps({
        "status": "ok", "data": {
            "access_token": access_token,
            "status": 'new' if manager.new_system_user else 'exist',
            "customer_id": manager.user_id
        }})


@blueprint.route('/customer/login/send_code', methods=['POST'])
def send_code():
    """Send dynamic code to customer."""
    params = json.loads(request.data)
    zone = params.get('zone')
    phone = params.get('phone')
    try:
        login_code_service = VerifyCode(phone, zone)
        code = login_code_service.send_code()
    except LocalError as err:
        return get_error_response(err)
    data = {"code": code} if DEBUG else {}
    return json.dumps({"status": "ok", "data": data})
