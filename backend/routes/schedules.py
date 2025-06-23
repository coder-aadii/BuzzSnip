from flask import Blueprint, request, jsonify
import os
import json
from datetime import datetime, timedelta
import logging
from .auth import require_auth

schedules_bp = Blueprint('schedules', __name__)
logger = logging.getLogger(__name__)

SCHEDULES_FILE = 'data/schedules.json'

@schedules_bp.route('', methods=['GET'])
@require_auth
def get_schedules():
    """Get all schedules"""
    try:
        schedules = load_schedules()
        return jsonify(schedules)
        
    except Exception as e:
        logger.error(f"Get schedules error: {str(e)}")
        return jsonify({'error': 'Failed to get schedules'}), 500

@schedules_bp.route('', methods=['POST'])
@require_auth
def create_schedule():
    """Create a new schedule"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'persona_id', 'frequency', 'time', 'platforms']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        schedules = load_schedules()
        
        # Generate schedule ID
        schedule_id = f"schedule_{len(schedules) + 1:03d}"
        
        # Calculate next run time
        next_run = calculate_next_run(data['frequency'], data['time'], data.get('days', []))
        
        # Create new schedule
        new_schedule = {
            'id': schedule_id,
            'name': data['name'],
            'persona_id': data['persona_id'],
            'frequency': data['frequency'],
            'time': data['time'],
            'days': data.get('days', []),
            'platforms': data['platforms'],
            'theme': data.get('theme', ''),
            'duration': data.get('duration', 30),
            'auto_post': data.get('auto_post', True),
            'status': data.get('status', 'active'),
            'next_run': next_run,
            'last_run': None,
            'total_runs': 0,
            'success_rate': 100,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        schedules.append(new_schedule)
        save_schedules(schedules)
        
        logger.info(f"Created new schedule: {schedule_id}")
        return jsonify({'success': True, 'schedule': new_schedule}), 201
        
    except Exception as e:
        logger.error(f"Create schedule error: {str(e)}")
        return jsonify({'error': 'Failed to create schedule'}), 500

@schedules_bp.route('/<schedule_id>', methods=['GET'])
@require_auth
def get_schedule(schedule_id):
    """Get a specific schedule"""
    try:
        schedules = load_schedules()
        schedule = next((s for s in schedules if s['id'] == schedule_id), None)
        
        if not schedule:
            return jsonify({'error': 'Schedule not found'}), 404
        
        return jsonify(schedule)
        
    except Exception as e:
        logger.error(f"Get schedule error: {str(e)}")
        return jsonify({'error': 'Failed to get schedule'}), 500

@schedules_bp.route('/<schedule_id>', methods=['PUT'])
@require_auth
def update_schedule(schedule_id):
    """Update a schedule"""
    try:
        data = request.get_json()
        schedules = load_schedules()
        
        # Find schedule
        schedule_index = next((i for i, s in enumerate(schedules) if s['id'] == schedule_id), None)
        if schedule_index is None:
            return jsonify({'error': 'Schedule not found'}), 404
        
        # Update schedule
        schedule = schedules[schedule_index]
        
        # Update fields
        updatable_fields = [
            'name', 'persona_id', 'frequency', 'time', 'days', 'platforms',
            'theme', 'duration', 'auto_post', 'status'
        ]
        
        for field in updatable_fields:
            if field in data:
                schedule[field] = data[field]
        
        # Recalculate next run if timing changed
        if any(field in data for field in ['frequency', 'time', 'days']):
            schedule['next_run'] = calculate_next_run(
                schedule['frequency'], 
                schedule['time'], 
                schedule['days']
            )
        
        schedule['updated_at'] = datetime.utcnow().isoformat()
        
        save_schedules(schedules)
        
        logger.info(f"Updated schedule: {schedule_id}")
        return jsonify({'success': True, 'schedule': schedule})
        
    except Exception as e:
        logger.error(f"Update schedule error: {str(e)}")
        return jsonify({'error': 'Failed to update schedule'}), 500

@schedules_bp.route('/<schedule_id>', methods=['DELETE'])
@require_auth
def delete_schedule(schedule_id):
    """Delete a schedule"""
    try:
        schedules = load_schedules()
        
        # Find and remove schedule
        schedules = [s for s in schedules if s['id'] != schedule_id]
        
        save_schedules(schedules)
        
        logger.info(f"Deleted schedule: {schedule_id}")
        return jsonify({'success': True, 'message': 'Schedule deleted'})
        
    except Exception as e:
        logger.error(f"Delete schedule error: {str(e)}")
        return jsonify({'error': 'Failed to delete schedule'}), 500

@schedules_bp.route('/<schedule_id>/status', methods=['PATCH'])
@require_auth
def update_schedule_status(schedule_id):
    """Update schedule status (active/paused)"""
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status field required'}), 400
        
        if data['status'] not in ['active', 'paused']:
            return jsonify({'error': 'Status must be active or paused'}), 400
        
        schedules = load_schedules()
        
        # Find schedule
        schedule = next((s for s in schedules if s['id'] == schedule_id), None)
        if not schedule:
            return jsonify({'error': 'Schedule not found'}), 404
        
        # Update status
        schedule['status'] = data['status']
        schedule['updated_at'] = datetime.utcnow().isoformat()
        
        save_schedules(schedules)
        
        logger.info(f"Updated schedule status: {schedule_id} -> {data['status']}")
        return jsonify({'success': True, 'schedule': schedule})
        
    except Exception as e:
        logger.error(f"Update schedule status error: {str(e)}")
        return jsonify({'error': 'Failed to update schedule status'}), 500

@schedules_bp.route('/<schedule_id>/run', methods=['POST'])
@require_auth
def run_schedule_now(schedule_id):
    """Trigger a schedule to run immediately"""
    try:
        schedules = load_schedules()
        
        # Find schedule
        schedule = next((s for s in schedules if s['id'] == schedule_id), None)
        if not schedule:
            return jsonify({'error': 'Schedule not found'}), 404
        
        # TODO: Trigger immediate execution
        # This would integrate with the content generation system
        
        logger.info(f"Triggered immediate run for schedule: {schedule_id}")
        return jsonify({'success': True, 'message': 'Schedule triggered'})
        
    except Exception as e:
        logger.error(f"Run schedule error: {str(e)}")
        return jsonify({'error': 'Failed to run schedule'}), 500

def load_schedules():
    """Load schedules from JSON file"""
    try:
        if os.path.exists(SCHEDULES_FILE):
            with open(SCHEDULES_FILE, 'r') as f:
                return json.load(f)
        else:
            # Return default schedules if file doesn't exist
            return get_default_schedules()
            
    except Exception as e:
        logger.error(f"Load schedules error: {str(e)}")
        return get_default_schedules()

def save_schedules(schedules):
    """Save schedules to JSON file"""
    try:
        os.makedirs('data', exist_ok=True)
        with open(SCHEDULES_FILE, 'w') as f:
            json.dump(schedules, f, indent=2)
            
    except Exception as e:
        logger.error(f"Save schedules error: {str(e)}")

def calculate_next_run(frequency, time, days):
    """Calculate next run time for a schedule"""
    try:
        now = datetime.utcnow()
        hour, minute = map(int, time.split(':'))
        
        if frequency == 'daily':
            next_run = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            if next_run <= now:
                next_run += timedelta(days=1)
        
        elif frequency == 'weekly':
            # Find next occurrence of specified days
            if not days:
                # Default to weekly from today
                next_run = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
                next_run += timedelta(days=7)
            else:
                # Find next day in the list
                weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                current_weekday = now.weekday()
                
                target_days = [weekdays.index(day.lower()) for day in days if day.lower() in weekdays]
                target_days.sort()
                
                next_day = None
                for day in target_days:
                    if day > current_weekday:
                        next_day = day
                        break
                
                if next_day is None:
                    next_day = target_days[0] if target_days else current_weekday
                    days_ahead = 7 - current_weekday + next_day
                else:
                    days_ahead = next_day - current_weekday
                
                next_run = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
                next_run += timedelta(days=days_ahead)
        
        elif frequency == 'monthly':
            next_run = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            if next_run <= now:
                # Move to next month
                if now.month == 12:
                    next_run = next_run.replace(year=now.year + 1, month=1)
                else:
                    next_run = next_run.replace(month=now.month + 1)
        
        else:
            # Default to daily
            next_run = now.replace(hour=hour, minute=minute, second=0, microsecond=0)
            if next_run <= now:
                next_run += timedelta(days=1)
        
        return next_run.isoformat()
        
    except Exception as e:
        logger.error(f"Calculate next run error: {str(e)}")
        # Return tomorrow at the specified time as fallback
        tomorrow = datetime.utcnow() + timedelta(days=1)
        return tomorrow.replace(hour=12, minute=0, second=0, microsecond=0).isoformat()

def get_default_schedules():
    """Get default schedules"""
    return [
        {
            'id': 'schedule_001',
            'name': 'Daily Tech Tips',
            'persona_id': 'tech_guru_hindi',
            'frequency': 'daily',
            'time': '14:00',
            'days': [],
            'platforms': ['youtube', 'instagram'],
            'theme': 'ai_tips',
            'duration': 30,
            'auto_post': True,
            'status': 'active',
            'next_run': calculate_next_run('daily', '14:00', []),
            'last_run': '2024-01-15T14:00:00Z',
            'total_runs': 25,
            'success_rate': 96,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        },
        {
            'id': 'schedule_002',
            'name': 'Weekly Workout',
            'persona_id': 'fitness_coach',
            'frequency': 'weekly',
            'time': '08:00',
            'days': ['monday', 'wednesday', 'friday'],
            'platforms': ['instagram'],
            'theme': 'workout_tips',
            'duration': 25,
            'auto_post': True,
            'status': 'active',
            'next_run': calculate_next_run('weekly', '08:00', ['monday', 'wednesday', 'friday']),
            'last_run': '2024-01-15T08:00:00Z',
            'total_runs': 12,
            'success_rate': 100,
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat()
        }
    ]