from flask import Flask, flash,request, jsonify, redirect, url_for, session, render_template, g
from werkzeug.exceptions import HTTPException  
from controllers.auth_controller import auth_bp, get_valid_access_token
from controllers.spotify_controller import spotify_bp
from controllers.youtube_controller import youtube_bp
from controllers.migrate_controller import migration_bp
from config import config
from flask_talisman import Talisman
import logging
from pythonjsonlogger import jsonlogger
from logging.handlers import RotatingFileHandler
from prometheus_flask_exporter import PrometheusMetrics
from time import time
import os


def configure_logging(app):
    """
    Configures structured logging for the Flask application.

    Logs will be written to a rotating file or to stdout in JSON format.
    """
    # configure log level
    app.logger.setLevel(logging.INFO)

    # configure rotating file handler
    file_handler = RotatingFileHandler("app.log", maxBytes=10240, backupCount=10)
    file_handler.setLevel(logging.INFO)

    # JSON formatter
    formatter = jsonlogger.JsonFormatter(
        "%(asctime)s %(levelname)s %(name)s %(message)s"
    )
    file_handler.setFormatter(formatter)

    # ddd the handler to the Flask logger
    app.logger.addHandler(file_handler)

    # redirect logs to stdout (useful for Render)
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    app.logger.addHandler(stream_handler)

def register_error_handlers(app):
    """
    Registers global error handlers for the application.
    """
    @app.errorhandler(Exception)
    def handle_exception(e):
        app.logger.error(f"Unhandled Exception: {e}")
        response = {"error": "An unexpected error occurred."}
        if isinstance(e, HTTPException):
            response["description"] = e.description
            return jsonify(response), e.code
        return jsonify(response), 500    


def add_timing_middleware(app):
    """
    set a middleware that tracks the response time for each incoming request.
    """
    @app.before_request
    def start_timer():
        g.start = time()

    @app.after_request
    def log_request(response):
        if hasattr(g, 'start'):
            duration = time() - g.start
            app.logger.info(f"Request took {duration:.4f} seconds")
        return response

csp = {
    'default-src': ["'self'"],
    'script-src': ["'self'"],  # Permitir scripts de FontAwesome
    'connect-src': ["'self'", "https://ka-f.fontawesome.com", "http://127.0.0.1:5000/"],  # Conexiones externas permitidas
    'style-src': ["'self'", "'unsafe-inline'"],  # Estilos
    'img-src': [
        "'self'",
        "https://accounts.scdn.co",            # Imágenes de Spotify Accounts
        "https://i.scdn.co",                  # Imágenes de Spotify
        "https://image-cdn-ak.spotifycdn.com",# CDN principal de Spotify
        "https://image-cdn-fa.spotifycdn.com",# CDN adicional de Spotify
        "https://mosaic.scdn.co",             # Mosaicos de Spotify
        "https://i.ytimg.com",                # Miniaturas de YouTube
        "https://yt3.ggpht.com",              # Imágenes de perfil de YouTube
        "data:"                           # Inline images
    ],
    'font-src': ["'self'"],  # Fuentes
}     

def create_app():
    """
    Configures and creates an instance of the Flask app with the necessary settings and extensions.

    Steps:
        - Loads configuration settings from config.py.        
        - Registers blueprints for modular route handling:
            /auth: Routes related to authentication.
            /spotify: Routes for Spotify integrations.
            /youtube: Routes for YouTube integrations.        

        Returns: 
            Configured Flask application instance.
    """
    app = Flask(__name__)

    config_name = os.getenv("FLASK_ENV","default")
    # load the configuration from config.py.
    app.config.from_object(config[config_name])

    # use Flask-Prometheus to obtain server metrics.
    PrometheusMetrics(app)
    # configure logging
    configure_logging(app)
    # security headers
    Talisman(app, content_security_policy=csp)
    # register a registers global error handlers for the application.
    register_error_handlers(app)
    # register a middleware that tracks the response time for each incoming request.
    add_timing_middleware(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(spotify_bp, url_prefix='/spotify')
    app.register_blueprint(youtube_bp, url_prefix='/youtube')
    app.register_blueprint(migration_bp, url_prefix="/migration")

    @app.before_request
    def check_access_token():
        """
        Verify the token for each request, particularly on protected routes. 
        If the access token is invalid, redirect the user to the login page.
        """
        # ignore authentication routes.
        if request.endpoint is not None and 'auth' in request.endpoint:  
            return

        # Allow unverified access to static files
        if request.path.startswith('/static'):  return None 
        
        # Check if the user has a valid access token
        if not get_valid_access_token():
            if session.get("user") is None:
                # User has never authenticated or has logged out
                flash("To view this content, you need to authenticate first.")
            else:
                # User was authenticated, but the token has expired
                flash("Your authentication has expired. Please sign in again.")
            
            return redirect(url_for('auth.sign_in_page')) 

    @app.route('/dashboard')
    def dashboard():       
        return render_template("dashboard.html") 

    @app.route('/dashboard/playlist/youtube/<playlist_id>')
    def dashboard_yt_playlist(playlist_id):       
        return render_template("dashboard.html")

    @app.route('/dashboard/playlist/spotify/<playlist_id>')
    def dashboard_sp_playlist(playlist_id):       
        return render_template("dashboard.html")

    return app

app = create_app()

if __name__ == "__main__":       
    app.logger.info("Starting the application")
    debug_mode = app.config.get("DEBUG")
    app.run(debug=debug_mode, host='localhost', port=8000)
    


