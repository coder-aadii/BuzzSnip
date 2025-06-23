# 🤖 BuzzSnip — AI Influencer Video Bot for Reels & Shorts

> Automatically generate and post short, high-quality, lip-synced videos featuring realistic AI personas — designed for **Instagram Reels** and **YouTube Shorts**, using 100% free, offline, open-source tools.

---

## 🚀 Key Highlights

* 👥 **Multi-persona support** for niches like fashion, fitness, tech (e.g., Ritika AI, Aarohi FitAI, TechShree)
* 🖼️ **Photorealistic face image generation** using **Stable Diffusion**
* 👄 **Lip-sync video creation** with **SadTalker** (or **Wav2Lip** fallback)
* 🗣️ **Natural voice synthesis** using **Bark**, **Tortoise TTS**, or **gTTS**
* ✍️ **Auto script generation** using local LLMs like **TinyLlama**
* 🎞️ **Dynamic 15–30 sec videos** in vertical format with **HD/4K** quality
* 🧠 AI Upscaling with **Real-ESRGAN** or **CodeFormer**
* 🖼️ **Stylized thumbnails** (modern, bold, minimal, gradient)
* 📅 **Scheduled content generation** and auto-posting
* 📲 **Auto-upload to YouTube Shorts and Instagram Reels**
* 📊 Command-line and Flask-based web dashboard
* 🔒 **Secure .env-based credential management**
* 💸 **Completely free**, **offline-capable**, and **open-source**

---

## 🎯 Ideal For

* AI creators & influencers who want to **automate video content**
* Storytellers building **narrative-driven short videos**
* Agencies managing **multiple digital personas**
* Anyone who wants to **auto-post daily HD content** without manual editing

---

## 🏗️ Workflow Overview

```plaintext
[ Script Prompt ]  →  [ Voice with Bark/Tortoise ]  →  [ Face from SD ]  
         →  [ Lip-sync via SadTalker ]  →  [ Upscale (1080p/4K) ]  
         →  [ Compose & Add Overlay ]  →  [ Generate Thumbnail ]  
         →  [ Auto-post on Reels & Shorts ]
```

---

## 📦 Tech Stack

| Component      | Tool / Framework         |
| -------------- | ------------------------ |
| Web UI         | React + Material UI      |
| API Backend    | Flask                    |
| AI Services    | Python microservices     |
| Image Gen      | Stable Diffusion         |
| Face Animation | SadTalker / Wav2Lip      |
| Voice          | Bark / Tortoise / gTTS   |
| LLM (script)   | TinyLlama                |
| Video Editing  | MoviePy + OpenCV         |
| Upscaling      | Real-ESRGAN / CodeFormer |
| Uploading      | YouTube API + Selenium   |
| Automation     | Scheduler + Cron         |
| Secrets        | .env file + dotenv       |

---

## 📥 Setup Instructions (Summarized)

```bash
# 1. Clone the repo
git clone https://github.com/coder-aadii/buzzsnip.git && cd buzzsnip

# 2. Set up env vars
cp .env.example .env  # then fill in .env manually

# 3. Run full system with Docker (recommended)
docker-compose up -d

# OR manual setup:
# Backend
cd backend && pip install -r requirements.txt && python app.py
# AI Services
cd ../ai-services && pip install -r requirements.txt && python download_models.py --all && python app.py
# Frontend
cd ../frontend && npm install && npm start
```

---

## 🧠 Persona Configuration (Example)

```json
{
  "tech_guru_hindi": {
    "name": "TechShree",
    "language": "Hindi-English (Hinglish)",
    "voice_type": "bark",
    "prompt": "A confident, sharp Indian tech influencer, photorealistic, 8k, focused lighting",
    "themes": ["gadget_reviews", "ai_tips", "coding_hacks"],
    "personality_traits": ["smart", "calm", "helpful"],
    "signature_phrases": [
      "Aaj ka tech secret...",
      "Yeh feature bilkul next-level hai!",
      "Agar aap coder ho toh yeh zaroor try karo!"
    ]
  }
}
```

---

## 🎬 Output Quality

* 🕒 15–30 sec max duration
* 📐 9:16 vertical (1080x1920) with upscaling if needed
* 🎙️ Expressive Hinglish voice + synced lips
* 🎨 Beautiful thumbnails with branding
* 🗓️ Scheduled post delivery to YouTube + Instagram

---

## 🧪 Run Content Generation via API

```bash
# POST video generation task
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "persona_id": "tech_guru_hindi",
    "theme": "gadget_reviews",
    "duration": 30
  }'
```

---

## 🔐 Secure Your Tokens

All credentials go in `.env` like:

```
YOUTUBE_API_KEY=...
INSTAGRAM_USERNAME=...
PERSONA_TECH_GURU_HINDI_YOUTUBE_PASSWORD=...
```

---

## 🗓️ Scheduling Format

You can define schedules via `shared/config/schedule.json`:

```json
{
  "tech_guru_hindi": {
    "frequency": "daily",
    "time": "14:00",
    "platforms": ["youtube", "instagram"]
  }
}
```

---

## 📜 License

MIT — Use freely and responsibly.

---

## ⚠️ Final Notes

> ⚙️ **Performance Notice**: Each video can take 10–30 minutes to render depending on GPU. BuzzSnip is optimized for **quality**, not speed.
>
> 🚨 **Disclaimer**: You are responsible for usage in accordance with social media platform policies.
