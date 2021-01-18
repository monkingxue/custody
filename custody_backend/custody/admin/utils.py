#!/usr/bin/env python
# encoding: utf-8
from datetime import timedelta

from flask_admin.helpers import get_redirect_target

from custody.settings import ADMIN_URL
from custody.sys.tzutil import ts2dt


class AdminSaveRedirect:
    def get_save_return_url(self, model, is_created=False):
        redirect = get_redirect_target()
        return ADMIN_URL + redirect


def timestamp_format(value):
    if not value:
        return ""
    dt = ts2dt(value) + timedelta(hours=8)
    return dt.strftime('%Y-%m-%d %H:%M:%S')
