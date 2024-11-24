import requests
import json

class YoutubeConnection:
    def __init__(self, access_token):
        self.root_url = "http://127.0.0.1:5000/youtube"
        self.access_token = access_token

    def request(self, method, endpoint, params=None, json=None):
        try:
            response = requests.request(
                method,
                f"{self.root_url}/{endpoint}",
                headers={"x-access-token": self.access_token},
                params=params,
                json=json
            )   
            response.raise_for_status()              
            return response.json(),response.status_code
        except requests.exceptions.HTTPError as http_err:            
            return {"error": f"HTTP error occurred: {http_err}", "status": response.status_code}
        except Exception as err:
            return {"error": f"Other error occurred: {err}"}

    def login(self):
        """
        Generates the Youtube login URL where the user needs to authenticate.
        
        Returns:
        --------
        JSON response containing the Youtube authorization URL.
        """
        return self.request("GET", "auth/login")

    def exchange_for_token(self, code):
        """
        Requests to the API to authenticate a user using Youtube authentication.    

        Parameters:
        ----------
        code : string            
        """
        return self.request("GET", "auth/callback", params={"code": code})

    def logout(self):
        return self.request("POST", "auth/logout")

    def user_data(self):
        """
        Retrieves details of the user account. 

        Returns:
        -----------
        dict: Details of the user account including name, followers, profile picture, etc.
        """
        return self.request("GET", "user_data")       

    def get_playlists_list(self):
        """
        Retrieves the playlists of the specified user by making a request to Youtube’s API.      

        Returns: 
        -----------
        A list of playlists owned by the user.
        """
        return self.request("GET", "playlists")

    def get_playlist(self, playlist_id):
        """
        Retrieves details of a specific playlist by its ID.

        Parameters:
        -----------        
        playlist_id (str): The ID of the playlist to retrieve.

        Returns:
        -----------
        dict: Details of the playlist including name, description, and tracks.       
        """
        return self.request("GET", f"playlists/{playlist_id}")            



