# -*- coding: utf-8 -*-
"""Customer models."""
import enum

from custody.database import Column, Model, SurrogatePK, db, DictMixin


class CustomerStatus(enum.Enum):
    normal = 0
    banned = 10

    @classmethod
    def status_text(cls, status):
        names = {
            cls.normal.value: "normal",
            cls.banned.value: "banned"
        }
        return names.get(status) or ""


class Customer(SurrogatePK, Model, DictMixin):
    """Customer of custody."""

    __tablename__ = 'customer'
    identity = Column(db.String(80), unique=True, nullable=False)
    name = Column(db.String(80), default='')
    fund_password = Column(db.String(64))
    status = Column(db.SmallInteger, default=CustomerStatus.normal.value)
    avatar_url = Column(db.String(1024), default=None)
    create_time = Column(db.Integer)

    def __init__(self, name, **kwargs):
        """Create instance."""
        db.Model.__init__(self, name=name, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Customer({name})>'.format(name=self.name)
