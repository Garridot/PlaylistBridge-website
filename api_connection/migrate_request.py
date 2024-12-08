import requests
import json
import os

class migrationConnection:
    def __init__(self, access_token):
        self.root_url = os.getenv("API_URL","http://127.0.0.1:5000") + "/migrate"
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
            response.raise_for_status()  # Verifica que no haya errores HTTP
            return response
        except requests.exceptions.HTTPError as http_err:           
            return {"error": f"HTTP error occurred: {http_err}", "status": response.status_code}
        except Exception as err:
            return {"error": f"Other error occurred: {err}"}

    def migrate_spotify_playlist(self, playlist_id):
        """
        Migrates a Spotify playlist to YouTube.

        Parameters:        
        - playlist_id: ID of the Spotify playlist to migrate
        """
        return self.request("POST", f"spotify-to-youtube/{playlist_id}")    

    def migrate_youtube_playlist(self, playlist_id):
        """
        Migrates a YouTube playlist to Spotify.

        Parameters:        
        - playlist_id: ID of the YouTube playlist to migrate
        """
        return self.request("POST", f"youtube-to-spotify/{playlist_id}")            