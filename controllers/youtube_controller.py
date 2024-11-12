from flask import Blueprint, request, jsonify, redirect, render_template, session, url_for, flash
from controllers.auth_controller import get_valid_access_token
from api_connection.youtube_request import YoutubeConnection
from datetime import datetime, timedelta
import requests

youtube_bp = Blueprint('youtube', __name__)

@youtube_bp.route('/get_auth_url', methods=['GET'])
def get_youtube_auth_url(): 
    youtube = YoutubeConnection(get_valid_access_token())  
    youtube_url = youtube.login()     
    return jsonify(youtube_url)

@youtube_bp.route('/callback', methods=['GET'])
def get_youtube_auth(): 
    youtube = YoutubeConnection(get_valid_access_token())  
    # Capture URL parameters.
    code = request.args.get("code")    
    # Ensure that the authorization code is present in the response.
    if not code: return "Authorization failed. No code provided.", 400

    response = youtube.exchange_for_token(code) 
           
    # Redirect the user to the home page.
    return redirect(url_for('dashboard')) 

    return jsonify(youtube_url)    

@youtube_bp.route('/playlists', methods=['GET'])
def get_youtube_playlists(): 
    youtube = YoutubeConnection(get_valid_access_token())   
    playlists = youtube.get_playlists_list()    
    return jsonify(playlists) 

@youtube_bp.route('/playlists/<playlist_id>', methods=['GET'])
def get_youtube_tracks(playlist_id): 
    youtube = YoutubeConnection(get_valid_access_token())   
    response = youtube.get_playlist(playlist_id)
    return jsonify(response) 