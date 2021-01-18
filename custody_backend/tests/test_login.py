# -*- coding: utf-8 -*-
"""Test login api."""
import json

class TestLoginApi:

    def test_login(self, user, testapp):
        """Test customer login."""
        res = testapp.post_json('/customer/login/send_code',
            {"zone": "86", "phone": "15986397130"})
        data = json.loads(res.text)
        assert data['status'] == 'ok'

        res = testapp.post_json('/customer/login', {
            "phone": "15986397130",
            "zone": "86",
            "code": data['data']['code']
        })
        data = json.loads(res.text)
        assert data['status'] == 'ok'
