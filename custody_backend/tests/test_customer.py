# -*- coding: utf-8 -*-
"""Test customer api."""
import json

from tests.utils import init_user_login


class TestCustomerApi:

    def test_login(self, user, testapp):
        """Test customer api."""
        access_token = init_user_login()
        headers = {"access-token": access_token}
        res = testapp.get('/customer', headers=headers)
        data = json.loads(res.text)
        assert data['status'] == 'ok'
