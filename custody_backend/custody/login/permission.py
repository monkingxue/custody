# -*- coding: utf-8 -*-
from flask import g
from functools import wraps


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        error_response = {
            "status": "fail",
            "error": {"var": "permission.login_required", "message": "需要先进行登录"}
        }
        if not g.session:
            return error_response
        return f(*args, **kwargs)
    return decorated_function
