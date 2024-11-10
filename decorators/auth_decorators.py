from flask import redirect, session, url_for, flash
from functools import wraps

def is_user_authenticated():
    """
    Check if the user is authenticated based on session data.
    Returns:
        bool: True if user data and valid access token are in session, else False.
    """
    from controllers.auth_controller import get_valid_access_token
    return session.get("user") is not None and get_valid_access_token() is not None

def anonymous_required(f):
    """
    Decorator to restrict access to routes for authenticated users only.
    If the user is authenticated, redirect them to the dashboard.
    Args:
        get_valid_access_token (function): Function to retrieve a valid access token.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if is_user_authenticated():
            flash("You are already signed in.")
            return redirect(url_for('dashboard'))  # Reemplaza con tu ruta protegida
        return f(*args, **kwargs)
    return decorated_function