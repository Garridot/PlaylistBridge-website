from flask import Blueprint, request, jsonify, redirect, render_template, session, url_for, flash
from controllers.auth_controller import get_valid_access_token
from api_connection.youtube_request import YoutubeConnection
from datetime import datetime, timedelta
import requests

youtube_bp = Blueprint('youtube', __name__)

@youtube_bp.route('/get_auth_url', methods=['GET'])
def get_youtube_auth_url(): 
    youtube = YoutubeConnection(get_valid_access_token())  
    response = youtube.login()   
    try:
        return jsonify({"data": response[0], "status": response[1] })
    except:
        return jsonify({"error": response["error"]}, {"status": response["status"]})     

@youtube_bp.route('/callback', methods=['GET'])
def get_youtube_auth(): 
    youtube = YoutubeConnection(get_valid_access_token())  
    # Capture URL parameters.
    code = request.args.get("code")    
    # Ensure that the authorization code is present in the response.
    if not code: return "Authorization failed. No code provided.", 400
    
    response = youtube.exchange_for_token(code) 
    if response[1] == 200:             
        # Redirect the user to the home page.
        return redirect(url_for('dashboard')) 

@youtube_bp.route('/get_playlists', methods=['GET'])
def get_youtube_playlists(): 
    youtube = YoutubeConnection(get_valid_access_token())   
    response = youtube.get_playlists_list()  
    try:
        return jsonify({"data": response[0], "status": response[1] })
    except:
        return jsonify({"error": response["error"]}, {"status": response["status"]})     

@youtube_bp.route('/playlists/<playlist_id>', methods=['GET'])
def get_youtube_tracks(playlist_id): 
    youtube = YoutubeConnection(get_valid_access_token())   
    response = youtube.get_playlist(playlist_id)
    try:
        return jsonify({"data": response[0], "status": response[1] })
    except:
        return jsonify({"error": response["error"]}, {"status": response["status"]})      

@youtube_bp.route('/logout', methods=['GET'])        
def logout():
    youtube = YoutubeConnection(get_valid_access_token())   
    response = youtube.logout() 
    if response[1] == 200:
        return redirect(url_for('dashboard')) 

@youtube_bp.route('/user_info', methods=['GET'])        
def get_user_info():
    youtube = YoutubeConnection(get_valid_access_token())   
    response = youtube.user_data()    
    try:
        return jsonify({"data": response[0], "status": response[1] })
    except:
        return jsonify({"error": response["error"]}, {"status": response["status"]})     