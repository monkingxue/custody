#!/usr/bin/env python
# encoding: utf-8
from flask_admin.contrib.sqla import ModelView
from flask_login import current_user

from custody.admin.utils import AdminSaveRedirect, timestamp_format
from custody.extensions import db
from custody.models import Customer
from custody.models.customer import CustomerStatus


class CustomerAdminView(AdminSaveRedirect, ModelView):
    can_create = True
    can_edit = False
    can_export = True
    can_delete = False

    column_default_sort = [('id', False)]

    column_list = Customer.get_column_names()
    column_searchable_list = ()
    column_filters = ('id', 'identity', 'name', 'status')

    column_formatters = dict(
        status=lambda v, c, m, p: CustomerStatus.status_text(m.status),
        create_time=lambda v, c, m, p: timestamp_format(m.create_time)
    )

    def is_accessible(self):
        return current_user.is_authenticated

    def __init__(self, **kwargs):
        super(CustomerAdminView, self) \
            .__init__(Customer, db.session, endpoint='customers', **kwargs)
