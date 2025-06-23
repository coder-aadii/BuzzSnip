from flask import Blueprint, request, jsonify
import os
import json
import uuid
from datetime import datetime
import logging
import requests
from .auth import require_auth

content_bp = Blueprint('content', __name__)
logger = logging.getLogger(__name__)

# AI Services base URL
AI_SERVICES_URL = os.getenv('AI_SERVICES_URL', 'http://localhost:5001')

@content_bp.route('/generate', methods=['POST'])
@require_auth
def generate_automated():
    """Automated video generation endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['persona_id', 'theme', 'duration']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate unique job ID
        job_id = str(uuid.uuid4())
        
        # Create job record
        job_data = {
            'job_id': job_id,
            'type': 'automated',
            'status': 'queued',
            'persona_id': data['persona_id'],
            'theme': data['theme'],
            'duration': data['duration'],
            'platforms': data.get('platforms', ['youtube']),
            'auto_upload': data.get('auto_upload', True),
            'schedule_time': data.get('schedule_time'),
            'created_at': datetime.utcnow().isoformat(),
            'progress': 0
        }
        
        # Save job to data store
        save_job(job_data)
        
        # Send to AI services for processing
        try:
            ai_response = requests.post(
                f"{AI_SERVICES_URL}/generate/automated",
                json=data,
                headers={'X-Job-ID': job_id},
                timeout=30
            )
            
            if ai_response.status_code == 200:
                logger.info(f"Automated generation started for job: {job_id}")
                return jsonify({
                    'success': True,
                    'job_id': job_id,
                    'status': 'queued',
                    'message': 'Video generation started'
                })
            else:
                logger.error(f"AI services error: {ai_response.text}")
                return jsonify({'error': 'Failed to start generation'}), 500
                
        except requests.RequestException as e:
            logger.error(f"AI services connection error: {str(e)}")
            return jsonify({'error': 'AI services unavailable'}), 503
            
    except Exception as e:
        logger.error(f"Automated generation error: {str(e)}")
        return jsonify({'error': 'Generation failed'}), 500

@content_bp.route('/generate-audio', methods=['POST'])
@require_auth
def generate_audio():
    """Manual audio generation endpoint"""
    try:
        data = request.get_json()
        
        required_fields = ['script', 'voice_type', 'persona_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Send to AI services
        try:
            ai_response = requests.post(
                f"{AI_SERVICES_URL}/generate/audio",
                json=data,
                timeout=120  # Audio generation can take time
            )
            
            if ai_response.status_code == 200:
                result = ai_response.json()
                logger.info(f"Audio generated successfully")
                return jsonify({
                    'success': True,
                    'audio_url': result.get('audio_url'),
                    'duration': result.get('duration'),
                    'file_size': result.get('file_size')
                })
            else:
                logger.error(f"Audio generation error: {ai_response.text}")
                return jsonify({'error': 'Audio generation failed'}), 500
                
        except requests.RequestException as e:
            logger.error(f"AI services connection error: {str(e)}")
            return jsonify({'error': 'AI services unavailable'}), 503
            
    except Exception as e:
        logger.error(f"Audio generation error: {str(e)}")
        return jsonify({'error': 'Audio generation failed'}), 500

@content_bp.route('/generate-face', methods=['POST'])
@require_auth
def generate_face():
    """Manual face generation endpoint"""
    try:
        data = request.get_json()
        
        required_fields = ['persona_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Send to AI services
        try:
            ai_response = requests.post(
                f"{AI_SERVICES_URL}/generate/face",
                json=data,
                timeout=180  # Face generation can take time
            )
            
            if ai_response.status_code == 200:
                result = ai_response.json()
                logger.info(f"Face generated successfully")
                return jsonify({
                    'success': True,
                    'face_url': result.get('face_url'),
                    'resolution': result.get('resolution'),
                    'file_size': result.get('file_size')
                })
            else:
                logger.error(f"Face generation error: {ai_response.text}")
                return jsonify({'error': 'Face generation failed'}), 500
                
        except requests.RequestException as e:
            logger.error(f"AI services connection error: {str(e)}")
            return jsonify({'error': 'AI services unavailable'}), 503
            
    except Exception as e:
        logger.error(f"Face generation error: {str(e)}")
        return jsonify({'error': 'Face generation failed'}), 500

@content_bp.route('/generate-video', methods=['POST'])
@require_auth
def generate_video():
    """Manual video generation endpoint"""
    try:
        data = request.get_json()
        
        required_fields = ['audio_url', 'face_url']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Send to AI services
        try:
            ai_response = requests.post(
                f"{AI_SERVICES_URL}/generate/video",
                json=data,
                timeout=600  # Video generation can take a long time
            )
            
            if ai_response.status_code == 200:
                result = ai_response.json()
                logger.info(f"Video generated successfully")
                return jsonify({
                    'success': True,
                    'video_url': result.get('video_url'),
                    'duration': result.get('duration'),
                    'resolution': result.get('resolution'),
                    'file_size': result.get('file_size'),
                    'thumbnail_url': result.get('thumbnail_url')
                })
            else:
                logger.error(f"Video generation error: {ai_response.text}")
                return jsonify({'error': 'Video generation failed'}), 500
                
        except requests.RequestException as e:
            logger.error(f"AI services connection error: {str(e)}")
            return jsonify({'error': 'AI services unavailable'}), 503
            
    except Exception as e:
        logger.error(f"Video generation error: {str(e)}")
        return jsonify({'error': 'Video generation failed'}), 500

@content_bp.route('/jobs/<job_id>', methods=['GET'])
@require_auth
def get_job_status(job_id):
    """Get job status"""
    try:
        job = load_job(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        return jsonify(job)
        
    except Exception as e:
        logger.error(f"Job status error: {str(e)}")
        return jsonify({'error': 'Failed to get job status'}), 500

@content_bp.route('/posts', methods=['GET'])
@require_auth
def get_posts():
    """Get all posts/content history"""
    try:
        posts = load_posts()
        return jsonify(posts)
        
    except Exception as e:
        logger.error(f"Get posts error: {str(e)}")
        return jsonify({'error': 'Failed to get posts'}), 500

def save_job(job_data):
    """Save job data to file"""
    try:
        os.makedirs('data/jobs', exist_ok=True)
        job_file = f"data/jobs/{job_data['job_id']}.json"
        
        with open(job_file, 'w') as f:
            json.dump(job_data, f, indent=2)
            
    except Exception as e:
        logger.error(f"Save job error: {str(e)}")

def load_job(job_id):
    """Load job data from file"""
    try:
        job_file = f"data/jobs/{job_id}.json"
        
        if os.path.exists(job_file):
            with open(job_file, 'r') as f:
                return json.load(f)
        return None
        
    except Exception as e:
        logger.error(f"Load job error: {str(e)}")
        return None

def load_posts():
    """Load all posts from data directory"""
    try:
        posts = []
        posts_dir = 'data/posts'
        
        if os.path.exists(posts_dir):
            for filename in os.listdir(posts_dir):
                if filename.endswith('.json'):
                    with open(os.path.join(posts_dir, filename), 'r') as f:
                        post = json.load(f)
                        posts.append(post)
        
        # Sort by creation date (newest first)
        posts.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        return posts
        
    except Exception as e:
        logger.error(f"Load posts error: {str(e)}")
        return []