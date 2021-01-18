# -*- coding: utf-8 -*-
"""Test deposit api."""
import json


class TestAppStat:
    def test_app_stat(self, user, testapp):
        res = testapp.get('/app_stat')
        data = json.loads(res.text)
        assert data['status'] == 'ok'

