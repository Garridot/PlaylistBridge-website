from flask import Flask, flash,request, jsonify, redirect, url_for, session, render_template
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
        Verify the token for each request, particularly on protected routes. 
        If the access token is invalid, redirect the user to the login page.
        """
        # ignore authentication routes.
        if request.endpoint is not None and 'auth' in request.endpoint:  
            return
        
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
    
    return app

app = create_app()

if __name__ == "__main__": 
    app.run(host='localhost', port=8000, debug=True)
    


