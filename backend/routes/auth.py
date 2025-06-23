from flask import Blueprint, request, jsonify
import os
import jwt
from datetime import datetime, timedelta
import logging

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Admin login endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password required'}), 400
        
        email = data['email']
        password = data['password']
        
        # Get admin credentials from environment
        admin_email = os.getenv('ADMIN_EMAIL', 'aditya.admin@buzzsnip.com')
        admin_password = os.getenv('ADMIN_PASSWORD', '9074_Qwerty')
        
        # Verify credentials
        if email == admin_email and password == admin_password:
            # Generate JWT token
            token_payload = {
                'email': email,
                'exp': datetime.utcnow() + timedelta(hours=24),
                'iat': datetime.utcnow()
            }
            
            token = jwt.encode(
                token_payload,
                os.getenv('SECRET_KEY', 'buzzsnip-dev-key'),
                algorithm='HS256'
            )
            
            logger.info(f"Successful login for admin: {email}")
            
            return jsonify({
                'success': True,
                'token': token,
                'user': {
                    'email': email,
                    'role': 'admin'
                },
                'expires_in': 86400  # 24 hours in seconds
            })
        else:
            logger.warning(f"Failed login attempt for email: {email}")
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/verify', methods=['POST'])
def verify_token():
    """Verify JWT token"""
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(
                token,
                os.getenv('SECRET_KEY', 'buzzsnip-dev-key'),
                algorithms=['HS256']
            )
            
            return jsonify({
                'valid': True,
                'user': {
                    'email': payload['email'],
                    'role': 'admin'
                }
            })
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
            
    except Exception as e:
        logger.error(f"Token verification error: {str(e)}")
        return jsonify({'error': 'Token verification failed'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout endpoint (client-side token removal)"""
    return jsonify({'success': True, 'message': 'Logged out successfully'})

def require_auth(f):
    """Decorator to require authentication"""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Authentication required'}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(
                token,
                os.getenv('SECRET_KEY', 'buzzsnip-dev-key'),
                algorithms=['HS256']
            )
            request.user = payload
            return f(*args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
            
    return decorated_function