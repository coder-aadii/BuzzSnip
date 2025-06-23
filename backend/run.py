#!/usr/bin/env python3
"""
BuzzSnip Backend Server
Run script for the Flask API server
"""

import os
import sys
import logging
from app import app
from config import Config

def setup_logging():
    """Setup logging configuration"""
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    # Create logs directory if it doesn't exist
    os.makedirs('logs', exist_ok=True)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            logging.FileHandler('logs/backend.log'),
            logging.StreamHandler(sys.stdout)
        ]
    )

def main():
    """Main function to run the Flask app"""
    setup_logging()
    logger = logging.getLogger(__name__)
    
    # Initialize configuration
    Config.init_app(app)
    
    logger.info("Starting BuzzSnip Backend Server...")
    logger.info(f"Environment: {os.getenv('FLASK_ENV', 'development')}")
    logger.info(f"Debug mode: {Config.DEBUG}")
    logger.info(f"Host: {Config.HOST}")
    logger.info(f"Port: {Config.PORT}")
    
    try:
        # Run the Flask app
        app.run(
            host=Config.HOST,
            port=Config.PORT,
            debug=Config.DEBUG,
            threaded=True
        )
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()