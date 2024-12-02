from flask import Blueprint, request, jsonify, redirect, render_template, session, url_for, flash
from api_connection.auth_request import AuthConnection
from decorators.auth_decorators import anonymous_required 
from datetime import datetime, timedelta
import requests

auth_bp = Blueprint('auth', __name__)

auth = AuthConnection()

@auth_bp.route('/auth/login_page')
@anonymous_required
def sign_in_page():
    return render_template('login.html')

@auth_bp.route('/auth/register_page')
@anonymous_required
def register_page():
    return render_template('register.html')

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """
    Registers a new user and logs them in.

    Expects JSON payload with 'email' and 'password'.
    On successful registration and login, returns a success message.

    Returns:
        Response: JSON response with a success or failure message and HTTP status code.
    """

    data = request.get_json()   

    email = data['email']
    password = data['password']  

    response = auth.register_user({'email': email, 'password': password})

    if response.status_code == 201:

        auth = login_user({'email': email, 'password': password})

        if auth.status_code == 200:               
            return jsonify({'message': 'Register and login successful'}), response.status_code
        else:
            return jsonify({'message': 'Login failed'}), response.status_code

    else:
        return jsonify({'message': 'Register failed'}), response.status_code


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """
    Authenticates a user and saves session data.

    Expects JSON payload with 'email' and 'password'.
    On successful login, stores access token, refresh token, and user profile in the session.

    Returns:
        Response: JSON response with a success or failure message and HTTP status code.
    """

    data = request.get_json()   

    email = data['email']
    password = data['password']  

    response = auth.login_user({'email': email, 'password': password})

    if response.status_code == 200:
        save_profile_data(data)         
        return jsonify({'message': 'Login successful'}), response.status_code
    else:
        return jsonify({'message': 'Login failed'}), response.status_code


@auth_bp.route('/auth/google', methods=['GET'])
@anonymous_required
def auth_google():
    """
    Redirects to Google OAuth authentication URL.

    Returns:
        Response: Redirect to Google authentication URL.
    """
    google_url = auth.get_google_auth_url()    
    return redirect(google_url.json()["google_auth_url"]) 

@auth_bp.route('/auth/google/callback', methods=['GET'])
@anonymous_required
def google_callback():
    """
    Handles Google OAuth callback and exchanges code for tokens.

    Expects 'code' query parameter from Google.
    On successful exchange, saves token and user data to session.

    Returns:
        Response: Redirect to dashboard or error message if authentication fails.
    """

    # Capture URL parameters.
    code = request.args.get("code")
    # Ensure that the authorization code is present in the response.
    if not code: return "Authorization failed. No code provided.", 400
    # Request to the API to exchange the code for the access token.
    response = auth.exchange_for_token(code) 
    if response.status_code == 200:
        data = response.json() 
        save_profile_data(data)
        # Redirect the user to the home page.
        return redirect(url_for('dashboard'))
    else:
        flash("Authentication has failed. Please try again later, or attempt to log in manually.")         
        return redirect(url_for('auth.sign_in_page'))
    

@auth_bp.route('/auth/logout', methods=['GET'])
def logout():
    """
    Logs out the user by revoking their access token and clearing the session.

    Returns:
        Response: JSON response with a success or failure message and HTTP status code.
    """
    access_token = get_valid_access_token()
    response = auth.revoke_refresh_token(access_token)
    if response.status_code == 200: 
        session.clear()
        return redirect(url_for('auth.sign_in_page'))   

def save_profile_data(data):
    """
    Saves access token, refresh token, and user profile to the session.

    Args:
        data (dict): Dictionary containing 'access_token', 'refresh_token', and 'user' profile.
    """

    access_token_expires = datetime.now() + timedelta(minutes=30)

    session["access_token"] = data.get("access_token")
    session['access_token_expires'] = access_token_expires.isoformat()
    session["refresh_token"] = data.get("refresh_token")
    session["user"] = data.get("user")

def get_valid_access_token():
    """
    Retrieves a valid access token from session, refreshing it if expired.

    Returns:
        str: Valid access token for the user or None if unavailable.
    """

    access_token = session.get('access_token')
    access_token_expires = session.get('access_token_expires')

    # Ensure access_token_expires has a valid value
    if not access_token_expires:
        return None

    # Transform the expiration time into a datetime object
    try:
        access_token_expires = datetime.fromisoformat(access_token_expires)
    except ValueError:
        return None  # Return None if access_token_expires is not a valid ISO format

    # Check if the token has expired
    if datetime.now() >= access_token_expires:
        refresh_token = session.get('refresh_token')

        if not refresh_token:
            return None

        response = auth.refresh_access_token(refresh_token)
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to refresh token'}), response.status_code
        else:
            data = response.json()
            new_access_token = data.get("access_token")
            
            # Update the session with the new access token and its expiration time
            session['access_token'] = new_access_token
            session['access_token_expires'] = (datetime.now() + timedelta(minutes=30)).isoformat()
            
            access_token = new_access_token

    return access_token       
