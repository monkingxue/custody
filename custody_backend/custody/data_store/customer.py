# -*- coding: utf-8 -*-
"""Customer data store."""
from custody.models.customer import Customer


class CustomerDataStore:

    def get(self, id=None, identity=None):
        query = Customer.query
        if id:
            query = query.filter_by(id=id)
        if identity:
            query = query.filter_by(identity=identity)
        return query.first()
