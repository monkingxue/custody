#!/usr/bin/env python
# encoding: utf-8
from flask import Blueprint, request, g
from flask_restful import Api, Resource, reqparse

from custody.data_store.coin import CoinDataStore
from custody.extensions import cache

blueprint = Blueprint('coin', __name__)

api = Api(blueprint)


class SupportCoinView(Resource):
    """
        NOTE: 支持币种
    """

    @cache.cached(timeout=3, query_string=True)
    def get(self):
        coins = CoinDataStore().get_coins()
        result = [coin.to_dict(exclude_fields=['id']) for coin in coins]
        return {
            "status": "ok",
            "data": result
        }


api.add_resource(SupportCoinView, '/support_coin')
