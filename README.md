# 🤖 BuzzSnip — AI Influencer Bot Platform

> Create and manage multiple AI influencer personas across social media platforms using 100% FREE & open-source tools!

---

## 🚀 Features

- 👥 Support for **multiple AI influencer personas** (fashion, fitness, tech, etc.)
- 🖼️ Generate photorealistic face images using **Stable Diffusion**
- 🎬 Create talking head videos with **SadTalker** or **Wav2Lip**
- 🗣️ Convert text to natural speech using **Bark** or **Tortoise TTS**
- ✍️ Auto-generate scripts with local LLMs (Mistral, Phi, etc.)
- 🎞️ Add dynamic text overlays with **MoviePy** and **OpenCV**
- 🖼️ Auto-generate thumbnails for each video
- 📱 Auto-upload to **YouTube Shorts** and **Instagram Reels**
- 📊 Command-line interface and optional Flask dashboard
- 📅 Schedule content generation and posting
- 💸 Uses only **free**, **open-source** tools with **offline functionality**

---

## 📁 Project Structure

```
buzzsnip/
├── config/
│   └── accounts.json         # Persona definitions and credentials
├── assets/
│   ├── backgrounds/          # Background videos
│   └── personas/             # Generated persona images
│       ├── fashion_model/
│       ├── fitness_coach/
│       └── tech_girl/
├── output/
│   ├── fashion_model/        # Generated content per persona
│   ├── fitness_coach/
│   └── tech_girl/
├── models/                   # Local model weights (not tracked in git)
├── persona_config.py         # Loads and manages persona data
├── image_generator.py        # Handles Stable Diffusion image generation
├── script_generator.py       # Uses LLM to generate persona-based captions
├── voice_generator.py        # Converts script to audio using TTS
├── video_maker.py            # Creates full video with synced audio and overlays
├── thumbnail_maker.py        # Makes video thumbnail previews
├── uploader.py               # Manages uploads to YouTube and Instagram
├── scheduler.py              # Schedule content generation/posting
├── main.py                   # Entry point CLI or Flask controller
└── requirements.txt          # Python dependencies
```

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/buzzsnip.git
cd buzzsnip

# Create and activate virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download required models
python download_models.py
```

---

## 📥 Required Models

You'll need to download the following models:

1. **Stable Diffusion**:
   - Realistic Vision or Epic Photogasm checkpoint

2. **SadTalker**:
   - Face animation checkpoints

3. **Text-to-Speech**:
   - Bark or Tortoise TTS models

The `download_models.py` script will help you set up these models.

---

## 🧪 Usage

### Command Line Interface

```bash
# Generate content for a specific persona
python main.py --persona fashion_model --theme summer_outfits

# Generate and post content
python main.py --persona tech_girl --theme gadget_review --post

# Schedule content for all personas
python main.py --schedule daily --time "10:00"
```

### Web Dashboard (Optional)

```bash
# Start the Flask dashboard
python dashboard.py

# Access at http://localhost:5000
```

---

## 🌐 Persona Configuration

Edit `config/accounts.json` to define your AI influencer personas:

```json
{
  "fashion_model": {
    "name": "Sophia Style",
    "prompt": "a glamorous Instagram fashion model in Paris, photorealistic, 8k",
    "themes": ["summer_fashion", "winter_outfits", "accessories"],
    "voice_type": "female_enthusiastic",
    "social_media": {
      "youtube": {
        "username": "your_youtube_email",
        "password": "your_password"
      },
      "instagram": {
        "username": "your_instagram_username",
        "password": "your_password"
      }
    }
  },
  "fitness_coach": {
    "name": "Max Power",
    "prompt": "athletic male fitness coach with short hair, photorealistic, 8k",
    "themes": ["workout_tips", "nutrition", "motivation"],
    "voice_type": "male_deep",
    "social_media": {
      "youtube": {
        "username": "your_youtube_email",
        "password": "your_password"
      },
      "instagram": {
        "username": "your_instagram_username",
        "password": "your_password"
      }
    }
  }
}
```

---

## 💡 Built With

* [Python](https://www.python.org/)
* [Stable Diffusion](https://github.com/CompVis/stable-diffusion)
* [SadTalker](https://github.com/OpenTalker/SadTalker)
* [Bark TTS](https://github.com/suno-ai/bark)
* [Tortoise TTS](https://github.com/neonbjb/tortoise-tts)
* [Hugging Face Transformers](https://huggingface.co/transformers/)
* [MoviePy](https://zulko.github.io/moviepy/)
* [OpenCV](https://opencv.org/)
* [Flask](https://flask.palletsprojects.com/) (optional)
* [YouTube Data API](https://developers.google.com/youtube/v3)
* [Selenium](https://www.selenium.dev/)

---

## 📜 License

MIT License — Use it, remix it, share it freely.

---

## ⚠️ Disclaimer

This tool is for educational purposes only. Users are responsible for ensuring compliance with platform terms of service and applicable laws regarding AI-generated content, disclosure requirements, and copyright considerations.