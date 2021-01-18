#!/usr/bin/env python
# encoding: utf-8
from flask import Blueprint, request, g
from flask_restful import Api, Resource, reqparse

from custody.data_store.customer import CustomerDataStore
from custody.extensions import cache
from custody.login.permission import login_required

blueprint = Blueprint('customer', __name__)

api = Api(blueprint)


class CustomerView(Resource):
    """
        NOTE: 用户信息
    """

    @cache.cached(timeout=3, query_string=True)
    def get(self):
        if g.session is None:
            customer_id = None
        else:
            customer_id = g.session.get('user_id', None)
        if not customer_id:
            return {"status": "ok", "data": {}}  # NOTE: 没登录就返回一个空对象

        customer = CustomerDataStore().get(id=customer_id)
        if customer is None:
            return {"status": "ok", "data": {}}  # NOTE: 没数据也返回一个空对象
            # return {
            #     "status": "fail",
            #     "error": {"message": "用户不存在"}
            # }

        exclude_fields = ['fund_password', 'status', 'create_time']
        result = customer.to_dict(exclude_fields=exclude_fields)

        return {
            "status": "ok",
            "data": result
        }


api.add_resource(CustomerView, '/customer')
