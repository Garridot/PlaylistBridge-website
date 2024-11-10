from flask import Flask, request, jsonify, redirect, url_for
from controllers.auth_controller import auth_bp, get_valid_access_token
from config import Config

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
    app.config.from_object(Config)  # load the configuration from config.py.

    app.register_blueprint(auth_bp)

    @app.before_request
    def check_access_token():
        """
        Verify the token for each request, particularly on protected routes. If the access token is invalid, redirect the user to the login page.
        """
        if request.endpoint is not None and 'auth' in request.endpoint:  # ignore authentication routes.
            return
        
        if not get_valid_access_token():  
            return redirect(url_for('auth.sign_in_page'))  

    @app.route('/dashboard')
    def dashboard():
        return jsonify({"message": "Welcome to the dashboard!"} )              
    
    return app

app = create_app()

if __name__ == "__main__": 
    app.run(host='localhost', port=8000, debug=True)
    


