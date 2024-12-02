from flask import Blueprint, request, jsonify, redirect, render_template, session, url_for, flash
from controllers.auth_controller import get_valid_access_token
from api_connection.migrate_request import migrationConnection
from datetime import datetime, timedelta
import requests

migration_bp = Blueprint('migration', __name__)

@migration_bp.route('/migrate-spotify-playlist/<playlist_id>', methods=['POST'])
def migate_spotify_playlist(playlist_id):
    """
    Endpoint to migrate a Spotify playlist to YouTube.   
    """      
    migrate = migrationConnection(get_valid_access_token())  
    response = migrate.migrate_spotify_playlist(playlist_id)  
    try:        
        return jsonify({"data": response.json(), "status": response.status_code })
    except:
        return jsonify({"error": response["error"]}, {"status": response["status"]})  

@migration_bp.route('/migrate-youtube-playlist/<playlist_id>', methods=['POST'])
def migate_youtube_playlist(playlist_id):
    """
    Endpoint to migrate a YouTube playlist to Spotify.
    """    
    migrate = migrationConnection(get_valid_access_token())  
    response = migrate.migrate_youtube_playlist(playlist_id)  
    try:        
        return jsonify({"data": response.json(), "status": response.status_code })
    except:
        return jsonify({"error": response["error"]}, {"status": response["status"]})

@migration_bp.route('/youtube-to-spotify/<playlist_id>', methods=['POST'])
def render_migration_youtube(playlist_id):
    return render_template("migration_playlist.html")

@migration_bp.route('/spotify-to-youtube/<playlist_id>', methods=['POST'])
def render_migration_spotify(playlist_id):
    return render_template("migration_playlist.html")
