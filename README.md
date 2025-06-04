# 🤖 BuzzSnip — AI Influencer Bot Platform

> Create and manage multiple AI influencer personas across social media platforms using 100% FREE & open-source tools!

---

## 🚀 Features

- 👥 Support for **multiple AI influencer personas** (fashion, fitness, tech, etc.)
- 🖼️ Generate photorealistic face images using **Stable Diffusion**
- 🎬 Create talking head videos with **SadTalker** or **Wav2Lip**
- 🗣️ Convert text to natural speech using **Bark**, **Tortoise TTS**, or **gTTS**
- ✍️ Auto-generate scripts with local LLMs (TinyLlama, etc.)
- 🎞️ Add dynamic text overlays with **MoviePy** and **OpenCV**
- 🖼️ Auto-generate thumbnails for each video in multiple styles
- 📱 Auto-upload to **YouTube Shorts** and **Instagram Reels**
- 📊 Command-line interface and web-based dashboard
- 📅 Schedule content generation and posting
- 💸 Uses only **free**, **open-source** tools with **offline functionality**
- 🔒 Secure credential management with environment variables

---

## 📁 Project Structure

```
buzzsnip/
├── config/
│   ├── accounts.json         # Persona definitions (credentials in .env)
│   └── schedule.json         # Content generation schedules
├── assets/
│   ├── backgrounds/          # Background videos and images
│   └── personas/             # Generated persona images
│       ├── fashion_model_hindi/
│       ├── fitness_coach_hindi/
│       └── tech_guru_hindi/
├── output/
│   ├── fashion_model_hindi/
│   │   ├── audio/            # Generated audio files
│   │   ├── scripts/          # Generated scripts
│   │   ├── thumbnails/       # Generated thumbnails
│   │   └── videos/           # Generated videos
│   ├── fitness_coach_hindi/
│   └── tech_guru_hindi/
├── models/                   # Local model weights (not tracked in git)
│   ├── bark/                 # Bark TTS models
│   ├── llm/                  # Language models (TinyLlama)
│   ├── sadtalker/            # SadTalker models
│   ├── stable-diffusion/     # Stable Diffusion models
│   ├── tortoise/             # Tortoise TTS models
│   └── wav2lip/              # Wav2Lip models
├── templates/                # Web dashboard HTML templates
├── static/                   # Web dashboard static assets
├── persona_config.py         # Loads and manages persona data
├── image_generator.py        # Handles Stable Diffusion image generation
├── script_generator.py       # Uses LLM to generate persona-based scripts
├── voice_generator.py        # Converts script to audio using TTS
├── video_maker.py            # Creates full video with synced audio and overlays
├── thumbnail_maker.py        # Makes video thumbnail previews
├── uploader.py               # Manages uploads to YouTube and Instagram
├── scheduler.py              # Schedule content generation/posting
├── env_manager.py            # Manages environment variables and credentials
├── dashboard.py              # Web-based dashboard
├── main.py                   # Command-line interface
├── download_models.py        # Helper script to download required models
├── .env                      # Environment variables (not tracked in git)
├── .env.example              # Example environment variables template
└── requirements.txt          # Python dependencies
```

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/coder-aadii/buzzsnip.git
cd buzzsnip

# Create and activate virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Download required models
python download_models.py
```

---

## 🔐 Environment Variables

BuzzSnip uses environment variables for secure credential management. Copy `.env.example` to `.env` and fill in your credentials:

```
# General Settings
SECRET_KEY=your_secret_key_here

# YouTube API Credentials
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:5000/youtube/callback

# Instagram Credentials
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password

# Persona Credentials
PERSONA_FASHION_MODEL_HINDI_YOUTUBE_USERNAME=your_youtube_email
PERSONA_FASHION_MODEL_HINDI_YOUTUBE_PASSWORD=your_youtube_password
PERSONA_FASHION_MODEL_HINDI_INSTAGRAM_USERNAME=your_instagram_username
PERSONA_FASHION_MODEL_HINDI_INSTAGRAM_PASSWORD=your_instagram_password

# Hugging Face API Token (for model downloads)
HUGGINGFACE_TOKEN=your_huggingface_token

# Optional: Proxy settings
# HTTP_PROXY=http://your_proxy_server:port
# HTTPS_PROXY=https://your_proxy_server:port
```

---

## 📥 Required Models

You'll need to download the following models:

1. **Stable Diffusion**:
   - Realistic Vision v5.0 checkpoint

2. **SadTalker**:
   - Face animation checkpoints

3. **Text-to-Speech**:
   - Bark, Tortoise TTS, or gTTS (default)

4. **Language Model**:
   - TinyLlama for script generation

The `download_models.py` script will help you set up these models:

```bash
# Download all models
python download_models.py --all

# Or download specific models
python download_models.py --stable-diffusion --sadtalker
```

For faster downloads, add your Hugging Face token to the `.env` file.

---

## 🧪 Usage

### Command Line Interface

```bash
# List all available personas
python main.py --list-personas

# Create a new persona
python main.py --create-persona new_persona_id --name "New Persona" --prompt "description for image generation"

# Generate content for a specific persona
python main.py --persona fashion_model_hindi --theme summer_fashion

# Generate and post content
python main.py --persona tech_guru_hindi --theme gadget_review --post

# Schedule content for all personas
python main.py --schedule daily --time "10:00"

# Advanced options
python main.py --persona fashion_model_hindi --theme summer_fashion --duration 30 --tts-engine bark --animation-engine sadtalker --thumbnail-style modern --background "assets/backgrounds/summer_bg.mp4"
```

### Web Dashboard

```bash
# Start the web dashboard
python dashboard.py

# Access at http://localhost:5000
```

The web dashboard provides a user-friendly interface for:
- Managing personas
- Generating content
- Scheduling posts
- Uploading to social media
- Viewing generated content

---

## 🌐 Persona Configuration

Edit `config/accounts.json` to define your AI influencer personas:

```json
{
  "fashion_model_hindi": {
    "name": "Ritika AI",
    "language": "Hindi-English (Hinglish)",
    "voice_type": "gtts",
    "prompt": "a glamorous Indian fashion model in Mumbai, photorealistic, 8k, detailed face, beautiful eyes, natural lighting",
    "themes": ["summer_fashion", "wedding_fashion", "accessories", "gen_z_style"],
    "personality_traits": ["confident", "graceful", "friendly", "trendsetter", "culturally rooted"],
    "signature_phrases": [
      "Aaj ka fashion mantra...",
      "Yeh look bilkul perfect hai shaadi season ke lिए!",
      "Aapka outfit game strong hona chahiye, confidence के साथ!"
    ],
    "social_media": {}
  }
}
```

Note: Social media credentials are now stored in the `.env` file for security.

---

## 📅 Scheduling Content

Edit `config/schedule.json` or use the web dashboard to schedule content generation:

```json
{
  "personas": {
    "fashion_model_hindi": {
      "frequency": "daily",
      "time": "12:00",
      "days": [],
      "platforms": ["youtube", "instagram"],
      "last_post": null,
      "next_post": "2023-07-01 12:00:00"
    },
    "fitness_coach_hindi": {
      "frequency": "weekly",
      "time": "18:00",
      "days": ["monday", "thursday"],
      "platforms": ["youtube", "instagram"],
      "last_post": null,
      "next_post": "2023-07-03 18:00:00"
    }
  }
}
```

---

## 🎨 Thumbnail Styles

BuzzSnip supports multiple thumbnail styles:

1. **Modern** - Clean design with subtle effects
2. **Minimal** - Simple, elegant design with white background
3. **Bold** - Strong colors and large text
4. **Gradient** - Smooth color transitions with glow effects

---

## 💡 Built With

* [Python](https://www.python.org/)
* [Stable Diffusion](https://github.com/CompVis/stable-diffusion)
* [SadTalker](https://github.com/OpenTalker/SadTalker)
* [Wav2Lip](https://github.com/Rudrabha/Wav2Lip)
* [Bark TTS](https://github.com/suno-ai/bark)
* [Tortoise TTS](https://github.com/neonbjb/tortoise-tts)
* [gTTS](https://github.com/pndurette/gTTS)
* [TinyLlama](https://github.com/jzhang38/TinyLlama)
* [Hugging Face Transformers](https://huggingface.co/transformers/)
* [MoviePy](https://zulko.github.io/moviepy/)
* [OpenCV](https://opencv.org/)
* [Flask](https://flask.palletsprojects.com/)
* [YouTube Data API](https://developers.google.com/youtube/v3)
* [Selenium](https://www.selenium.dev/)
* [python-dotenv](https://github.com/theskumar/python-dotenv)

---

## 📜 License

MIT License — Use it, remix it, share it freely.

---

## ⚠️ Disclaimer

This tool is for educational purposes only. Users are responsible for ensuring compliance with platform terms of service and applicable laws regarding AI-generated content, disclosure requirements, and copyright considerations.