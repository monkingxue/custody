#!/usr/bin/env python
# encoding: utf-8
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user

from custody.admin.utils import AdminSaveRedirect
from custody.extensions import db
from custody.models import Coin
from custody.models.coin import CoinFavorite


class CoinAdminView(AdminSaveRedirect, ModelView):
    can_create = True
    can_edit = True
    can_export = True
    can_delete = True

    column_default_sort = [('id', True)]

    column_list = Coin.get_column_names()
    column_searchable_list = ()
    column_filters = ('slug', 'name', 'cn_fullname')

    def is_accessible(self):
        return current_user.is_authenticated

    def __init__(self, **kwargs):
        super(CoinAdminView, self) \
            .__init__(Coin, db.session, endpoint='coins', **kwargs)


class CoinFavoriteAdminView(AdminSaveRedirect, ModelView):
    can_create = True
    can_edit = True
    can_export = True
    can_delete = True

    column_default_sort = [('id', True)]

    column_list = CoinFavorite.get_column_names()
    column_searchable_list = ()
    column_filters = ('slug', )

    def is_accessible(self):
        return current_user.is_authenticated

    def __init__(self, **kwargs):
        super(CoinFavoriteAdminView, self) \
            .__init__(CoinFavorite, db.session, endpoint='coin_favorites', **kwargs)
