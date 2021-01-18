# -*- coding: utf-8 -*-
"""Coin models."""
import enum

from custody.database import Column, Model, SurrogatePK, db, DictMixin


class PairType(enum.Enum):

    spot = 1
    future = 2

    @classmethod
    def status_text(cls, status):
        names = {
            cls.spot.value: "spot",
            cls.future.value: "future",
        }
        return names.get(status) or ""


class FavoriteStatus(enum.Enum):

    follow = 1  # 关注
    cancel_follow = 10  # 取关

    @classmethod
    def status_text(cls, status):
        names = {
            cls.follow.value: "follow",
            cls.cancel_follow.value: "cancel_follow",
        }
        return names.get(status) or ""


class Coin(SurrogatePK, Model, DictMixin):
    '''coin item.'''

    __tablename__ = 'coin'
    slug = Column(db.String(64), unique=True)
    name = Column(db.String(64), index=True)
    fullname = Column(db.String(64))
    cn_fullname = Column(db.String(64))
    logo_url = Column(db.String(1024))


class CoinFavorite(SurrogatePK, Model, DictMixin):
    '''coin favorite item.'''

    __tablename__ = 'coin_favorite'
    customer_id = Column(db.Integer, index=True)
    slug = Column(db.String(32), index=True)
    status = Column(db.SmallInteger, index=True)
    update_time = Column(db.Integer)
