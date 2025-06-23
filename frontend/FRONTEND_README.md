# BuzzSnip Frontend - Admin Dashboard

## 🔐 Admin Authentication System

This is an **admin-only** application with secure login functionality.

### Admin Credentials
- **Email**: `aditya.admin@buzzsnip.com`
- **Password**: `9074_Qwerty`

*These credentials are stored in environment variables for security.*

---

## 🚀 Quick Start (Windows PowerShell)

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (Windows PowerShell compatible)
npm run start-win

# Or use standard start command
npm start
```

### Available Scripts

```powershell
# Development server
npm start

# Windows PowerShell specific (with port setting)
npm run start-win

# Build for production
npm build

# Run tests
npm test
```

---

## 🎯 Features

### 🔐 **Authentication System**
- Secure admin login page
- Session management (24-hour expiry)
- Automatic logout functionality
- Protected routes

### 🤖 **Automated Post Creation**
- AI persona selection (TechShree, Aarohi FitAI, Ritika AI)
- Content theme selection
- Video duration control (15-60 seconds)
- Platform targeting (YouTube Shorts, Instagram Reels)
- Scheduling options
- Real-time progress tracking

### ✋ **Manual Post Creation**
- Step-by-step workflow:
  - **Script Writing**: Custom script with character count
  - **Voice Generation**: Multiple TTS engines (Bark, Tortoise, gTTS)
  - **Visual Creation**: Face generation with custom prompts
  - **Video Composition**: Resolution selection and overlays
  - **Upload Management**: Platform-specific metadata

### 📊 **Post History & Analytics**
- Complete post management dashboard
- Performance metrics tracking
- Status monitoring (completed, processing, failed, scheduled)
- Filter and search functionality
- Retry failed posts
- Detailed post analytics

---

## 🎨 UI/UX Features

- **Modern Design**: Gradient backgrounds with glassmorphism effects
- **Responsive Layout**: Bootstrap-based responsive design
- **Animated Components**: Smooth transitions and hover effects
- **Progress Tracking**: Real-time progress bars for video generation
- **Alert System**: User-friendly notifications
- **Admin Dashboard**: Professional admin interface

---

## 🔧 Technical Stack

- **Frontend Framework**: React 19.1.0
- **UI Library**: Bootstrap 5 + React-Bootstrap
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Authentication**: Local storage with session management
- **Styling**: Custom CSS with Bootstrap integration

---

## 🌐 API Integration

The frontend is designed to work with the Flask backend API:

```javascript
// Example API endpoints
POST /api/generate          // Automated video generation
POST /api/generate-audio    // Manual audio generation
POST /api/generate-face     // Manual face generation
POST /api/generate-video    // Manual video composition
POST /api/upload            // Upload to platforms
GET  /api/posts             // Fetch post history
```

---

## 🔒 Security Features

- **Environment Variables**: Sensitive data stored in `.env` files
- **Session Management**: 24-hour session expiry
- **Protected Routes**: Authentication required for all features
- **Secure Logout**: Complete session cleanup
- **Admin-Only Access**: No public registration

---

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices (portrait/landscape)

---

## 🚨 Important Notes

1. **Admin Access Only**: This is not a public application
2. **Environment Variables**: Make sure `.env` file is properly configured
3. **Backend Dependency**: Requires Flask backend API to be running
4. **Session Expiry**: Login sessions expire after 24 hours
5. **Windows PowerShell**: Use semicolons (;) instead of && in commands

---

## 🐛 Troubleshooting

### Common Issues

**Login not working:**
- Check environment variables in `.env` file
- Verify credentials match exactly
- Clear browser localStorage if needed

**API calls failing:**
- Ensure backend server is running on port 5000
- Check CORS configuration
- Verify API endpoints are accessible

**Styling issues:**
- Clear browser cache
- Check if Bootstrap CSS is loading
- Verify custom CSS files are imported

---

## 📞 Support

For technical support or questions about the admin dashboard, please contact the development team.

---

*BuzzSnip Admin Dashboard v1.0 - AI-Powered Video Creation Platform*