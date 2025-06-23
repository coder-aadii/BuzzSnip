from flask import Blueprint, request, jsonify
import os
import json
import logging
from datetime import datetime
from .auth import require_auth

upload_bp = Blueprint('upload', __name__)
logger = logging.getLogger(__name__)

@upload_bp.route('/upload', methods=['POST'])
@require_auth
def upload_video():
    """Upload video to social media platforms"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['video_url', 'platforms', 'title']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        video_url = data['video_url']
        platforms = data['platforms']
        title = data['title']
        description = data.get('description', '')
        tags = data.get('tags', [])
        thumbnail_style = data.get('thumbnail_style', 'modern')
        
        upload_results = {}
        
        # Upload to each platform
        for platform in platforms:
            try:
                if platform == 'youtube':
                    result = upload_to_youtube(video_url, title, description, tags, thumbnail_style)
                    upload_results['youtube'] = result
                    
                elif platform == 'instagram':
                    result = upload_to_instagram(video_url, title, description, tags)
                    upload_results['instagram'] = result
                    
                else:
                    logger.warning(f"Unsupported platform: {platform}")
                    upload_results[platform] = {
                        'success': False,
                        'error': 'Unsupported platform'
                    }
                    
            except Exception as e:
                logger.error(f"Upload to {platform} failed: {str(e)}")
                upload_results[platform] = {
                    'success': False,
                    'error': str(e)
                }
        
        # Save upload record
        upload_record = {
            'id': f"upload_{int(datetime.utcnow().timestamp())}",
            'video_url': video_url,
            'title': title,
            'description': description,
            'tags': tags,
            'platforms': platforms,
            'results': upload_results,
            'uploaded_at': datetime.utcnow().isoformat()
        }
        
        save_upload_record(upload_record)
        
        # Check if any uploads succeeded
        success_count = sum(1 for result in upload_results.values() if result.get('success'))
        
        if success_count > 0:
            logger.info(f"Video uploaded successfully to {success_count}/{len(platforms)} platforms")
            return jsonify({
                'success': True,
                'message': f'Uploaded to {success_count}/{len(platforms)} platforms',
                'results': upload_results
            })
        else:
            logger.error("All platform uploads failed")
            return jsonify({
                'success': False,
                'message': 'All platform uploads failed',
                'results': upload_results
            }), 500
            
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        return jsonify({'error': 'Upload failed'}), 500

def upload_to_youtube(video_url, title, description, tags, thumbnail_style):
    """Upload video to YouTube Shorts"""
    try:
        # TODO: Implement actual YouTube API upload
        # This would use the YouTube Data API v3
        
        # For now, return mock success
        logger.info(f"Mock YouTube upload: {title}")
        
        return {
            'success': True,
            'platform': 'youtube',
            'video_id': f"yt_{int(datetime.utcnow().timestamp())}",
            'url': f"https://youtube.com/shorts/mock_video_id",
            'uploaded_at': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"YouTube upload error: {str(e)}")
        return {
            'success': False,
            'platform': 'youtube',
            'error': str(e)
        }

def upload_to_instagram(video_url, title, description, tags):
    """Upload video to Instagram Reels"""
    try:
        # TODO: Implement actual Instagram upload
        # This would use Instagram Basic Display API or automation
        
        # For now, return mock success
        logger.info(f"Mock Instagram upload: {title}")
        
        return {
            'success': True,
            'platform': 'instagram',
            'post_id': f"ig_{int(datetime.utcnow().timestamp())}",
            'url': f"https://instagram.com/reel/mock_post_id",
            'uploaded_at': datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Instagram upload error: {str(e)}")
        return {
            'success': False,
            'platform': 'instagram',
            'error': str(e)
        }

def save_upload_record(upload_record):
    """Save upload record to file"""
    try:
        os.makedirs('data/uploads', exist_ok=True)
        upload_file = f"data/uploads/{upload_record['id']}.json"
        
        with open(upload_file, 'w') as f:
            json.dump(upload_record, f, indent=2)
            
    except Exception as e:
        logger.error(f"Save upload record error: {str(e)}")

@upload_bp.route('/uploads', methods=['GET'])
@require_auth
def get_uploads():
    """Get upload history"""
    try:
        uploads = []
        uploads_dir = 'data/uploads'
        
        if os.path.exists(uploads_dir):
            for filename in os.listdir(uploads_dir):
                if filename.endswith('.json'):
                    with open(os.path.join(uploads_dir, filename), 'r') as f:
                        upload = json.load(f)
                        uploads.append(upload)
        
        # Sort by upload date (newest first)
        uploads.sort(key=lambda x: x.get('uploaded_at', ''), reverse=True)
        
        return jsonify(uploads)
        
    except Exception as e:
        logger.error(f"Get uploads error: {str(e)}")
        return jsonify({'error': 'Failed to get uploads'}), 500

@upload_bp.route('/uploads/<upload_id>', methods=['GET'])
@require_auth
def get_upload(upload_id):
    """Get specific upload details"""
    try:
        upload_file = f"data/uploads/{upload_id}.json"
        
        if os.path.exists(upload_file):
            with open(upload_file, 'r') as f:
                upload = json.load(f)
                return jsonify(upload)
        else:
            return jsonify({'error': 'Upload not found'}), 404
            
    except Exception as e:
        logger.error(f"Get upload error: {str(e)}")
        return jsonify({'error': 'Failed to get upload'}), 500