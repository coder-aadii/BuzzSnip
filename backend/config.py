import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Application configuration"""
    
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'buzzsnip-dev-key-change-in-production')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Server settings
    HOST = os.getenv('FLASK_HOST', '0.0.0.0')
    PORT = int(os.getenv('FLASK_PORT', 5000))
    
    # Admin credentials
    ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'aditya.admin@buzzsnip.com')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', '9074_Qwerty')
    
    # AI Services
    AI_SERVICES_URL = os.getenv('AI_SERVICES_URL', 'http://localhost:5001')
    AI_SERVICES_TIMEOUT = int(os.getenv('AI_SERVICES_TIMEOUT', 600))
    
    # File paths
    DATA_DIR = os.getenv('DATA_DIR', 'data')
    UPLOADS_DIR = os.getenv('UPLOADS_DIR', 'uploads')
    GENERATED_DIR = os.getenv('GENERATED_DIR', 'generated')
    LOGS_DIR = os.getenv('LOGS_DIR', 'logs')
    
    # Social media APIs
    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY', '')
    YOUTUBE_CLIENT_ID = os.getenv('YOUTUBE_CLIENT_ID', '')
    YOUTUBE_CLIENT_SECRET = os.getenv('YOUTUBE_CLIENT_SECRET', '')
    
    INSTAGRAM_USERNAME = os.getenv('INSTAGRAM_USERNAME', '')
    INSTAGRAM_PASSWORD = os.getenv('INSTAGRAM_PASSWORD', '')
    
    # Content settings
    MAX_VIDEO_DURATION = int(os.getenv('MAX_VIDEO_DURATION', 60))
    MAX_CONCURRENT_JOBS = int(os.getenv('MAX_CONCURRENT_JOBS', 3))
    AUTO_CLEANUP_DAYS = int(os.getenv('AUTO_CLEANUP_DAYS', 30))
    
    # CORS settings
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
    
    @staticmethod
    def init_app(app):
        """Initialize app with configuration"""
        # Create necessary directories
        for directory in [Config.DATA_DIR, Config.UPLOADS_DIR, Config.GENERATED_DIR, Config.LOGS_DIR]:
            os.makedirs(directory, exist_ok=True)
        
        # Create subdirectories
        os.makedirs(os.path.join(Config.DATA_DIR, 'jobs'), exist_ok=True)
        os.makedirs(os.path.join(Config.DATA_DIR, 'posts'), exist_ok=True)
        os.makedirs(os.path.join(Config.DATA_DIR, 'uploads'), exist_ok=True)

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}