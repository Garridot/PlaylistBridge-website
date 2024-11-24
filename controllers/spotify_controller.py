from flask import Blueprint, request, jsonify, redirect, render_template, session, url_for, flash
from controllers.auth_controller import get_valid_access_token
from api_connection.spotify_request import SpotifyConnection
from datetime import datetime, timedelta
import requests

spotify_bp = Blueprint('spotify', __name__)

@spotify_bp.route('/get_auth_url', methods=['GET'])
def get_spotify_auth_url(): 
    spotify = SpotifyConnection(get_valid_access_token())  
    response = spotify.login()     
    try:        
        return jsonify({"data": response.json(), "status": response.status_code })
    except:
        return jsonify({"error": response["error"]}, {"status": response["status"]}) 

@spotify_bp.route('/callback', methods=['GET'])
def get_spotify_auth(): 
    spotify = SpotifyConnection(get_valid_access_token())  
    # Capture URL parameters.
    code = request.args.get("code")
    # Ensure that the authorization code is present in the response.
    if not code: return "Authorization failed. No code provided.", 400

    response = spotify.exchange_for_token(code)   
    if response.status_code == 200:       
        # Redirect the user to the home page.
        return redirect(url_for('dashboard')) 

@spotify_bp.route('/playlists', methods=['GET'])
def get_spotify_playlists(): 
    spotify = SpotifyConnection(get_valid_access_token())   
    response = spotify.get_playlists_list()      
    try:        
        return jsonify({"data": response.json(), "status": response.status_code })
    except:
        return jsonify({"error": response["error"]}, {"status": response["status"]}) 

@spotify_bp.route('/playlists/<playlist_id>', methods=['GET'])
def get_spotify_tracks(playlist_id): 
    spotify = SpotifyConnection(get_valid_access_token())   
    response = spotify.get_playlist(playlist_id) 
    try:        
        return jsonify({"data": response.json(), "status": response.status_code })
    except:
        return jsonify({"error": response["error"]}, {"status": response["status"]}) 
        
@spotify_bp.route('/logout', methods=['GET'])        
def logout():
    spotify = SpotifyConnection(get_valid_access_token())   
    response = spotify.logout() 
    if response.status_code==200:
        return redirect(url_for('dashboard')) 
    

@spotify_bp.route('/user_info', methods=['GET'])        
def get_user_info():
    spotify = SpotifyConnection(get_valid_access_token())   
    response = spotify.user_data()         
    try:        
        return jsonify({"data": response.json(), "status": response.status_code })
    except:        
        return jsonify({"error": response["error"]}, {"status": response["status"]})       