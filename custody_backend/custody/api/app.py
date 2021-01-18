# -*- coding: utf-8 -*-
"""The app module, containing the app factory function."""
import logging
import sys

from flask import Flask, render_template, g, request

from custody import commands, public, user
from custody.extensions import (
    bcrypt,
    cache,
    csrf_protect,
    db,
    debug_toolbar,
    flask_static_digest,
    login_manager,
    migrate,
)
from custody.api.customer import login_views
from custody.api.customer import views as customer_views
from custody.api.coin import views as coin_views
from custody import models  # NOTE: 别删这行，用来flask db migrate的
from custody.login.session import Session


def create_app(config_object="custody.settings"):
    """Create application factory, as explained here: http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = Flask(__name__.split(".")[0])
    app.config.update(RESTFUL_JSON=dict(ensure_ascii=False))
    app.config.from_object(config_object)
    register_before_request(app)
    register_after_request(app)
    register_extensions(app)
    register_blueprints(app)
    register_shellcontext(app)
    register_commands(app)
    configure_logger(app)
    return app


def register_before_request(app):
    def set_session():
        g.session = {}
        s = Session()
        access_token = request.headers.get('access-token')
        if access_token:
            g.session = s.fetch(access_token)
            # if g.session:
            #     s.set_last_login(g.session)

    app.before_request(set_session)


def register_after_request(app):
    def apply_caching(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers[
            "Access-Control-Expose-Headers"] = "Authorization, Cache-Control, Content-Length, Date, Expires, Server, Transfer-Encoding"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Access-Token"
        response.headers["Access-Control-Request-Headers"] = "*"
        response.headers["Access-Control-Request-Method"] = "POST, GET, PUT, DELETE"
        return response

    app.after_request(apply_caching)


def register_extensions(app):
    """Register Flask extensions."""
    bcrypt.init_app(app)
    cache.init_app(app)
    db.init_app(app)
    csrf_protect.init_app(app)
    login_manager.init_app(app)
    debug_toolbar.init_app(app)
    migrate.init_app(app, db)
    flask_static_digest.init_app(app)
    return None


def register_blueprints(app):
    """Register Flask blueprints."""
    # app.register_blueprint(public.views.blueprint)
    # app.register_blueprint(user.views.blueprint)

    app.register_blueprint(login_views.blueprint)
    csrf_protect.exempt(login_views.blueprint)

    app.register_blueprint(customer_views.blueprint)
    csrf_protect.exempt(customer_views.blueprint)

    app.register_blueprint(coin_views.blueprint)
    csrf_protect.exempt(coin_views.blueprint)
    return None


def register_shellcontext(app):
    """Register shell context objects."""

    def shell_context():
        """Shell context objects."""
        return {"db": db, "User": user.models.User}

    app.shell_context_processor(shell_context)


def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.test)
    app.cli.add_command(commands.lint)


def configure_logger(app):
    """Configure loggers."""
    handler = logging.StreamHandler(sys.stdout)
    if not app.logger.handlers:
        app.logger.addHandler(handler)
