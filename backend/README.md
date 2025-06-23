# BuzzSnip Backend API

Flask-based REST API server for the BuzzSnip AI video creation platform.

## Quick Start

### Windows
```bash
# Run the start script
start.bat
```

### Manual Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python run.py
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout

### Content Generation
- `POST /api/generate` - Automated video generation
- `POST /api/generate-audio` - Manual audio generation
- `POST /api/generate-face` - Manual face generation
- `POST /api/generate-video` - Manual video composition
- `GET /api/jobs/<job_id>` - Get job status
- `GET /api/posts` - Get content history

### Persona Management
- `GET /api/personas` - List all personas
- `POST /api/personas` - Create new persona
- `GET /api/personas/<id>` - Get specific persona
- `PUT /api/personas/<id>` - Update persona
- `DELETE /api/personas/<id>` - Delete persona
- `PATCH /api/personas/<id>/status` - Update persona status

### Scheduling
- `GET /api/schedules` - List all schedules
- `POST /api/schedules` - Create new schedule
- `GET /api/schedules/<id>` - Get specific schedule
- `PUT /api/schedules/<id>` - Update schedule
- `DELETE /api/schedules/<id>` - Delete schedule
- `PATCH /api/schedules/<id>/status` - Update schedule status
- `POST /api/schedules/<id>/run` - Run schedule immediately

### Upload
- `POST /api/upload` - Upload video to platforms
- `GET /api/uploads` - Get upload history
- `GET /api/uploads/<id>` - Get specific upload

### Admin
- `GET /api/admin/settings` - Get admin settings
- `PUT /api/admin/settings/<category>` - Update settings
- `GET /api/admin/status` - Get system status
- `GET /api/admin/models` - Get AI model status
- `POST /api/admin/models/<name>/<action>` - Model actions
- `POST /api/admin/system/<action>` - System actions

## Configuration

Environment variables (create `.env` file):
```env
# Admin credentials
ADMIN_EMAIL=aditya.admin@buzzsnip.com
ADMIN_PASSWORD=9074_Qwerty

# Flask settings
SECRET_KEY=your-secret-key
FLASK_DEBUG=true
FLASK_HOST=0.0.0.0
FLASK_PORT=5000

# AI Services
AI_SERVICES_URL=http://localhost:5001

# Social Media APIs
YOUTUBE_API_KEY=your-youtube-api-key
INSTAGRAM_USERNAME=your-instagram-username
INSTAGRAM_PASSWORD=your-instagram-password
```

## Features

- ✅ JWT-based authentication
- ✅ RESTful API design
- ✅ CORS enabled for frontend
- ✅ Comprehensive error handling
- ✅ Request/response logging
- ✅ File-based data storage
- ✅ Modular route organization
- ✅ System monitoring
- ✅ Admin settings management

## Architecture

```
backend/
├── app.py              # Main Flask application
├── run.py              # Server startup script
├── config.py           # Configuration management
├── requirements.txt    # Python dependencies
├── start.bat          # Windows startup script
├── routes/            # API route modules
│   ├── auth.py        # Authentication routes
│   ├── content.py     # Content generation routes
│   ├── personas.py    # Persona management routes
│   ├── schedules.py   # Scheduling routes
│   ├── admin.py       # Admin routes
│   └── upload.py      # Upload routes
├── data/              # Data storage (created at runtime)
├── logs/              # Application logs
├── uploads/           # File uploads
└── generated/         # Generated content
```

## Development

The backend is ready to integrate with:
- Frontend React application (port 3000)
- AI Services (port 5001)
- Social media APIs (YouTube, Instagram)

All API endpoints return JSON responses and include proper error handling.