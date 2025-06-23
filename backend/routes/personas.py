from flask import Blueprint, request, jsonify
import os
import json
from datetime import datetime
import logging
from .auth import require_auth

personas_bp = Blueprint('personas', __name__)
logger = logging.getLogger(__name__)

PERSONAS_FILE = 'data/personas.json'

@personas_bp.route('', methods=['GET'])
@require_auth
def get_personas():
    """Get all personas"""
    try:
        personas = load_personas()
        return jsonify(personas)
        
    except Exception as e:
        logger.error(f"Get personas error: {str(e)}")
        return jsonify({'error': 'Failed to get personas'}), 500

@personas_bp.route('', methods=['POST'])
@require_auth
def create_persona():
    """Create a new persona"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['id', 'name', 'language', 'voice_type', 'prompt']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        personas = load_personas()
        
        # Check if persona ID already exists
        if any(p['id'] == data['id'] for p in personas):
            return jsonify({'error': 'Persona ID already exists'}), 400
        
        # Create new persona
        new_persona = {
            'id': data['id'],
            'name': data['name'],
            'language': data['language'],
            'voice_type': data['voice_type'],
            'prompt': data['prompt'],
            'themes': data.get('themes', []),
            'personality_traits': data.get('personality_traits', []),
            'signature_phrases': data.get('signature_phrases', []),
            'avatar_url': data.get('avatar_url', ''),
            'status': data.get('status', 'active'),
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'total_videos': 0,
            'total_views': 0,
            'last_used': None
        }
        
        personas.append(new_persona)
        save_personas(personas)
        
        logger.info(f"Created new persona: {data['id']}")
        return jsonify({'success': True, 'persona': new_persona}), 201
        
    except Exception as e:
        logger.error(f"Create persona error: {str(e)}")
        return jsonify({'error': 'Failed to create persona'}), 500

@personas_bp.route('/<persona_id>', methods=['GET'])
@require_auth
def get_persona(persona_id):
    """Get a specific persona"""
    try:
        personas = load_personas()
        persona = next((p for p in personas if p['id'] == persona_id), None)
        
        if not persona:
            return jsonify({'error': 'Persona not found'}), 404
        
        return jsonify(persona)
        
    except Exception as e:
        logger.error(f"Get persona error: {str(e)}")
        return jsonify({'error': 'Failed to get persona'}), 500

@personas_bp.route('/<persona_id>', methods=['PUT'])
@require_auth
def update_persona(persona_id):
    """Update a persona"""
    try:
        data = request.get_json()
        personas = load_personas()
        
        # Find persona
        persona_index = next((i for i, p in enumerate(personas) if p['id'] == persona_id), None)
        if persona_index is None:
            return jsonify({'error': 'Persona not found'}), 404
        
        # Update persona
        persona = personas[persona_index]
        
        # Update fields
        updatable_fields = [
            'name', 'language', 'voice_type', 'prompt', 'themes',
            'personality_traits', 'signature_phrases', 'avatar_url', 'status'
        ]
        
        for field in updatable_fields:
            if field in data:
                persona[field] = data[field]
        
        persona['updated_at'] = datetime.utcnow().isoformat()
        
        save_personas(personas)
        
        logger.info(f"Updated persona: {persona_id}")
        return jsonify({'success': True, 'persona': persona})
        
    except Exception as e:
        logger.error(f"Update persona error: {str(e)}")
        return jsonify({'error': 'Failed to update persona'}), 500

@personas_bp.route('/<persona_id>', methods=['DELETE'])
@require_auth
def delete_persona(persona_id):
    """Delete a persona"""
    try:
        personas = load_personas()
        
        # Find and remove persona
        personas = [p for p in personas if p['id'] != persona_id]
        
        save_personas(personas)
        
        logger.info(f"Deleted persona: {persona_id}")
        return jsonify({'success': True, 'message': 'Persona deleted'})
        
    except Exception as e:
        logger.error(f"Delete persona error: {str(e)}")
        return jsonify({'error': 'Failed to delete persona'}), 500

@personas_bp.route('/<persona_id>/status', methods=['PATCH'])
@require_auth
def update_persona_status(persona_id):
    """Update persona status (active/inactive)"""
    try:
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status field required'}), 400
        
        if data['status'] not in ['active', 'inactive']:
            return jsonify({'error': 'Status must be active or inactive'}), 400
        
        personas = load_personas()
        
        # Find persona
        persona = next((p for p in personas if p['id'] == persona_id), None)
        if not persona:
            return jsonify({'error': 'Persona not found'}), 404
        
        # Update status
        persona['status'] = data['status']
        persona['updated_at'] = datetime.utcnow().isoformat()
        
        save_personas(personas)
        
        logger.info(f"Updated persona status: {persona_id} -> {data['status']}")
        return jsonify({'success': True, 'persona': persona})
        
    except Exception as e:
        logger.error(f"Update persona status error: {str(e)}")
        return jsonify({'error': 'Failed to update persona status'}), 500

def load_personas():
    """Load personas from JSON file"""
    try:
        if os.path.exists(PERSONAS_FILE):
            with open(PERSONAS_FILE, 'r') as f:
                return json.load(f)
        else:
            # Return default personas if file doesn't exist
            return get_default_personas()
            
    except Exception as e:
        logger.error(f"Load personas error: {str(e)}")
        return get_default_personas()

def save_personas(personas):
    """Save personas to JSON file"""
    try:
        os.makedirs('data', exist_ok=True)
        with open(PERSONAS_FILE, 'w') as f:
            json.dump(personas, f, indent=2)
            
    except Exception as e:
        logger.error(f"Save personas error: {str(e)}")

def get_default_personas():
    """Get default personas"""
    return [
        {
            'id': 'tech_guru_hindi',
            'name': 'TechShree',
            'language': 'Hindi-English (Hinglish)',
            'voice_type': 'bark',
            'prompt': 'A confident, sharp Indian tech influencer, photorealistic, 8k, focused lighting',
            'themes': ['gadget_reviews', 'ai_tips', 'coding_hacks'],
            'personality_traits': ['smart', 'calm', 'helpful'],
            'signature_phrases': [
                'Aaj ka tech secret...',
                'Yeh feature bilkul next-level hai!',
                'Agar aap coder ho toh yeh zaroor try karo!'
            ],
            'avatar_url': '',
            'status': 'active',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'total_videos': 45,
            'total_views': 125000,
            'last_used': '2024-01-15T14:30:00Z'
        },
        {
            'id': 'fitness_coach',
            'name': 'Aarohi FitAI',
            'language': 'Hindi-English (Hinglish)',
            'voice_type': 'tortoise',
            'prompt': 'An energetic Indian fitness coach, athletic build, motivational expression, gym background',
            'themes': ['workout_tips', 'nutrition_advice', 'motivation', 'exercise_demos'],
            'personality_traits': ['energetic', 'motivational', 'disciplined', 'caring'],
            'signature_phrases': [
                'Aaj ka workout challenge...',
                'Fitness is not a destination, it\'s a journey!',
                'Strong body, strong mind!'
            ],
            'avatar_url': '',
            'status': 'active',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'total_videos': 32,
            'total_views': 89000,
            'last_used': '2024-01-14T16:20:00Z'
        },
        {
            'id': 'fashion_influencer',
            'name': 'Ritika AI',
            'language': 'Hindi-English (Hinglish)',
            'voice_type': 'gtts',
            'prompt': 'A glamorous Indian fashion model, stylish outfit, confident pose, modern background',
            'themes': ['outfit_ideas', 'style_tips', 'fashion_trends', 'beauty_hacks'],
            'personality_traits': ['stylish', 'confident', 'trendy', 'inspiring'],
            'signature_phrases': [
                'Aaj ka fashion mantra...',
                'Style is a way to say who you are!',
                'Fashion fades, but style is eternal!'
            ],
            'avatar_url': '',
            'status': 'inactive',
            'created_at': datetime.utcnow().isoformat(),
            'updated_at': datetime.utcnow().isoformat(),
            'total_videos': 28,
            'total_views': 67000,
            'last_used': '2024-01-12T13:45:00Z'
        }
    ]