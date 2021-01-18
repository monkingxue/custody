# -*- coding: utf-8 -*-
"""Coin data store."""
from custody.extensions import db
from custody.models.coin import Coin, CoinFavorite, FavoriteStatus


class CoinDataStore:

    def get_coins(self):
        return Coin.query.all()


# class CoinFavoriteDataStore:
#
#     def add(self, info):
#         item = CoinFavorite(**info)
#         db.session.add(item)
#         db.session.flush()
#         item_id = item.id
#         db.session.commit()
#         return item_id
#
#     def update(self, info):
#         customer_id = info['customer_id']
#         slug = info['slug']
#         query = CoinFavorite.query \
#             .filter_by(customer_id=customer_id, slug=slug)
#         coin_favorite = query.first()
#         if coin_favorite:
#             query.update(info)
#             item_id = coin_favorite.id
#             db.session.commit()
#         else:
#             item_id = self.add(info)
#         return item_id
#
#     def batch_get(self, customer_id):
#         return CoinFavorite.query \
#             .filter_by(customer_id=customer_id) \
#             .filter(CoinFavorite.status == FavoriteStatus.follow.value) \
#             .all()
#
#     def get(self, customer_id, slug):
#         return CoinFavorite.query \
#             .filter_by(customer_id=customer_id, slug=slug) \
#             .filter(CoinFavorite.status == FavoriteStatus.follow.value) \
#             .first()
#
#     def get_coin_count(self, customer_id):
#         return CoinFavorite.query \
#             .filter_by(customer_id=customer_id) \
#             .filter(CoinFavorite.status == FavoriteStatus.follow.value) \
#             .count()
#
#     def get_status_value(self, follow=True):
#         if follow:
#             return FavoriteStatus.follow.value
#         else:
#             return FavoriteStatus.cancel_follow.value
#
#     def get_status_text(self, follow=True):
#         if follow:
#             status = FavoriteStatus.follow.value
#         else:
#             status = FavoriteStatus.cancel_follow.value
#         return FavoriteStatus.status_text(status)



