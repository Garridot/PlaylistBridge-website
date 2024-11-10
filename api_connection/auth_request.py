import requests
import json

class AuthConnection:
    """
    provides functions for interacting with authentication-related endpoints.
    Each function sends requests to the PlaylistBridge API to handle user registration, login, and token management for third-party authentication providers.
    """
    def __init__(self):
        self.root_url  = "http://127.0.0.1:5000/auth"        

    def register_user(self, data_user):  
        """
        Requests to the API to register a new user manually with email and password authentication.   

        Parameters:
        ----------
        data_user : dict
            A dictionary containing user registration details:
            - 'email': User's email address.
            - 'password': Password provided by the user.

        Returns:
        -------
        Response
            Flask JSON response indicating the status of the registration:
            - Success message (201) if registration is successful.
            - Error message (400) if user already exists or if password is weak.
        """
        response = requests.post(f"{self.root_url}/register", json=data_user)
        return response
    
    def login_user(self, data_user):
        """
        Requests to the API to authenticate a user and return access and refresh tokens for a valid login.
        Parameters:
        ----------
        data_user : dict
            A dictionary containing user login details:
            - 'email': User's email address.
            - 'password': Password provided by the user.

        Returns:
        -------
        Response
            Flask JSON response containing:
            - 'access_token': JWT access token for session management.
            - 'refresh_token': JWT refresh token for prolonged access.
            - 'user': A dictionary with user's ID and email.
            - If credentials are invalid, returns a 401 error with an "Invalid credentials" message.    
        """
        response = requests.post(
            f"{self.root_url}/login", json=data_user
            )
        return response

    def get_google_auth_url(self):
        """
        Requests to the API to Google OAuth authentication URL.

        Returns:
            Response: Redirect to Google authentication URL.
        """
        response = requests.get(f"{self.root_url}/google/login")
        return response  

    def exchange_for_token(self, code):
        """
        Requests to the API to authenticate a user using Google authentication.    

        Parameters:
        ----------
        code : string        

        Returns:
        -------
        dict
            A dictionary containing:
            - 'access_token': JWT access token for authenticated access.
            - 'refresh_token': JWT refresh token for maintaining the session.
            - 'user': Original `user_info` provided for reference.  
        """
        response = requests.get(
            f"{self.root_url}/google/callback?code={code}"
            )
        return response

    def refresh_access_token(self, refresh_token):
        """
        Requests to the API to verifies the refresh token and generates a new access token.
        
        Returns:
            JSON with a new access token if valid, or an error message if invalid or expired.
        """
        response = requests.post(
            f"{self.root_url}/refresh-token", headers={"x-refresh-token": refresh_token}
            )
        return response   
    
    def revoke_refresh_token(self, access_token):   
        """
        Requests to the API delete the refresh token associated with the user ID.

        Parameters: 
            user_id (int) – The unique ID of the user.
        Exceptions: 
            Catches Redis errors to handle token revocation failures.
        """
        response = requests.post(
            f"{self.root_url}/logout", headers={"x-access-token": access_token}
            )
        return response 
     


