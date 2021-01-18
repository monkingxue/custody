# -*- coding: utf-8 -*-
from flask_admin import AdminIndexView
from flask_admin import expose
from flask_login import login_required


class HomeView(AdminIndexView):

    @login_required
    @expose('/')
    def index(self):
        stat = {}
        return self.render('admin/index.html', stat=stat)
