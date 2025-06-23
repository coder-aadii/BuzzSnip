from flask import Blueprint, request, jsonify
import os
import json
import psutil
import logging
from datetime import datetime
from .auth import require_auth

admin_bp = Blueprint('admin', __name__)
logger = logging.getLogger(__name__)

SETTINGS_FILE = 'data/settings.json'

@admin_bp.route('/settings', methods=['GET'])
@require_auth
def get_settings():
    """Get all admin settings"""
    try:
        settings = load_settings()
        return jsonify(settings)
        
    except Exception as e:
        logger.error(f"Get settings error: {str(e)}")
        return jsonify({'error': 'Failed to get settings'}), 500

@admin_bp.route('/settings/<category>', methods=['PUT'])
@require_auth
def update_settings(category):
    """Update settings for a specific category"""
    try:
        data = request.get_json()
        settings = load_settings()
        
        if category not in settings:
            return jsonify({'error': 'Invalid settings category'}), 400
        
        # Update the category settings
        settings[category].update(data)
        settings['last_updated'] = datetime.utcnow().isoformat()
        
        save_settings(settings)
        
        logger.info(f"Updated {category} settings")
        return jsonify({'success': True, 'settings': settings[category]})
        
    except Exception as e:
        logger.error(f"Update settings error: {str(e)}")
        return jsonify({'error': 'Failed to update settings'}), 500

@admin_bp.route('/status', methods=['GET'])
@require_auth
def get_system_status():
    """Get system status and performance metrics"""
    try:
        # Get system metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Get GPU info if available
        gpu_usage = 0
        try:
            import GPUtil
            gpus = GPUtil.getGPUs()
            if gpus:
                gpu_usage = gpus[0].load * 100
        except ImportError:
            pass
        
        # Get active jobs count
        active_jobs = count_active_jobs()
        queue_length = count_queued_jobs()
        
        # Calculate uptime
        boot_time = datetime.fromtimestamp(psutil.boot_time())
        uptime = datetime.now() - boot_time
        uptime_str = f"{uptime.days} days, {uptime.seconds // 3600} hours"
        
        status = {
            'cpu_usage': cpu_percent,
            'memory_usage': memory.percent,
            'gpu_usage': gpu_usage,
            'disk_usage': disk.percent,
            'active_jobs': active_jobs,
            'queue_length': queue_length,
            'uptime': uptime_str,
            'last_backup': get_last_backup_time(),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        return jsonify(status)
        
    except Exception as e:
        logger.error(f"Get system status error: {str(e)}")
        return jsonify({'error': 'Failed to get system status'}), 500

@admin_bp.route('/models', methods=['GET'])
@require_auth
def get_model_status():
    """Get AI model status"""
    try:
        # This would typically query the AI services
        # For now, return mock data
        models = [
            {
                'name': 'Stable Diffusion',
                'status': 'loaded',
                'size': '4.2 GB',
                'last_used': '2024-01-15T14:30:00Z',
                'memory_usage': '3.8 GB'
            },
            {
                'name': 'Bark TTS',
                'status': 'loaded',
                'size': '2.8 GB',
                'last_used': '2024-01-15T14:25:00Z',
                'memory_usage': '2.1 GB'
            },
            {
                'name': 'SadTalker',
                'status': 'loaded',
                'size': '1.5 GB',
                'last_used': '2024-01-15T14:20:00Z',
                'memory_usage': '1.2 GB'
            },
            {
                'name': 'Real-ESRGAN',
                'status': 'unloaded',
                'size': '67 MB',
                'last_used': '2024-01-14T16:45:00Z',
                'memory_usage': '0 MB'
            },
            {
                'name': 'TinyLlama',
                'status': 'loaded',
                'size': '2.2 GB',
                'last_used': '2024-01-15T14:35:00Z',
                'memory_usage': '1.8 GB'
            }
        ]
        
        return jsonify(models)
        
    except Exception as e:
        logger.error(f"Get model status error: {str(e)}")
        return jsonify({'error': 'Failed to get model status'}), 500

@admin_bp.route('/models/<model_name>/<action>', methods=['POST'])
@require_auth
def model_action(model_name, action):
    """Perform action on AI model (load/unload)"""
    try:
        if action not in ['load', 'unload']:
            return jsonify({'error': 'Invalid action'}), 400
        
        # TODO: Implement actual model loading/unloading
        # This would communicate with AI services
        
        logger.info(f"Model action: {action} {model_name}")
        return jsonify({'success': True, 'message': f'Model {action} successful'})
        
    except Exception as e:
        logger.error(f"Model action error: {str(e)}")
        return jsonify({'error': f'Failed to {action} model'}), 500

@admin_bp.route('/system/<action>', methods=['POST'])
@require_auth
def system_action(action):
    """Perform system actions (restart, backup, cleanup, etc.)"""
    try:
        if action == 'restart':
            # TODO: Implement system restart
            logger.info("System restart requested")
            return jsonify({'success': True, 'message': 'System restart initiated'})
        
        elif action == 'backup':
            # TODO: Implement backup
            logger.info("System backup requested")
            return jsonify({'success': True, 'message': 'Backup started'})
        
        elif action == 'cleanup':
            # TODO: Implement cleanup
            logger.info("System cleanup requested")
            return jsonify({'success': True, 'message': 'Cleanup started'})
        
        elif action == 'update':
            # TODO: Implement update check
            logger.info("Update check requested")
            return jsonify({'success': True, 'message': 'Update check completed'})
        
        elif action == 'logs':
            # TODO: Return recent logs
            logger.info("Logs requested")
            return jsonify({'success': True, 'message': 'Logs retrieved'})
        
        else:
            return jsonify({'error': 'Invalid system action'}), 400
        
    except Exception as e:
        logger.error(f"System action error: {str(e)}")
        return jsonify({'error': f'Failed to {action} system'}), 500

def load_settings():
    """Load settings from JSON file"""
    try:
        if os.path.exists(SETTINGS_FILE):
            with open(SETTINGS_FILE, 'r') as f:
                return json.load(f)
        else:
            return get_default_settings()
            
    except Exception as e:
        logger.error(f"Load settings error: {str(e)}")
        return get_default_settings()

def save_settings(settings):
    """Save settings to JSON file"""
    try:
        os.makedirs('data', exist_ok=True)
        with open(SETTINGS_FILE, 'w') as f:
            json.dump(settings, f, indent=2)
            
    except Exception as e:
        logger.error(f"Save settings error: {str(e)}")

def get_default_settings():
    """Get default settings"""
    return {
        'general': {
            'app_name': 'BuzzSnip',
            'app_version': '1.0.0',
            'max_video_duration': 60,
            'default_resolution': '1080p',
            'auto_cleanup_days': 30,
            'max_concurrent_jobs': 3
        },
        'ai_models': {
            'stable_diffusion_model': 'realistic-vision-v5',
            'voice_model': 'bark',
            'lip_sync_model': 'sadtalker',
            'upscaling_model': 'real-esrgan',
            'llm_model': 'tinyllama'
        },
        'social_media': {
            'youtube_api_key': '••••••••••••••••',
            'instagram_username': '•��••••••••••••••',
            'auto_upload_enabled': True,
            'max_upload_retries': 3,
            'upload_timeout': 300
        },
        'storage': {
            'output_directory': '/app/output',
            'temp_directory': '/app/temp',
            'models_directory': '/app/models',
            'max_storage_gb': 100,
            'auto_cleanup_enabled': True
        },
        'last_updated': datetime.utcnow().isoformat()
    }

def count_active_jobs():
    """Count active jobs"""
    try:
        jobs_dir = 'data/jobs'
        if not os.path.exists(jobs_dir):
            return 0
        
        active_count = 0
        for filename in os.listdir(jobs_dir):
            if filename.endswith('.json'):
                with open(os.path.join(jobs_dir, filename), 'r') as f:
                    job = json.load(f)
                    if job.get('status') in ['processing', 'queued']:
                        active_count += 1
        
        return active_count
        
    except Exception as e:
        logger.error(f"Count active jobs error: {str(e)}")
        return 0

def count_queued_jobs():
    """Count queued jobs"""
    try:
        jobs_dir = 'data/jobs'
        if not os.path.exists(jobs_dir):
            return 0
        
        queued_count = 0
        for filename in os.listdir(jobs_dir):
            if filename.endswith('.json'):
                with open(os.path.join(jobs_dir, filename), 'r') as f:
                    job = json.load(f)
                    if job.get('status') == 'queued':
                        queued_count += 1
        
        return queued_count
        
    except Exception as e:
        logger.error(f"Count queued jobs error: {str(e)}")
        return 0

def get_last_backup_time():
    """Get last backup time"""
    try:
        backup_file = 'data/last_backup.txt'
        if os.path.exists(backup_file):
            with open(backup_file, 'r') as f:
                return f.read().strip()
        return '2024-01-15T10:30:00Z'
        
    except Exception as e:
        logger.error(f"Get last backup time error: {str(e)}")
        return 'Unknown'