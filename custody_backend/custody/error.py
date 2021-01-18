# -*- coding: utf-8 -*-
import json

class LocalError(Exception):
    def __init__(self, var, message):
        self.var = var
        self.message = message

def get_error_response(err, as_json=True):
    rsp = dict(
        status='fail',
        error=dict(
            var=err.var,
            message=err.message
        )
    )
    return json.dumps(rsp) if as_json else rsp
