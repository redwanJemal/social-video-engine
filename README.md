# Social Video Engine 🎬

AI-powered social media video generator built with **Remotion** (React → Video).

Generate professional animated short-form videos (Reels/TikTok/Shorts) from just a JSON config. Zero manual editing. Zero cost per video.

## Features

- 🎨 **6 Animated Templates**: Intro, Kinetic Text, Stat Cards, List Reveal, Quote Card, CTA
- 🎨 **6 Color Themes**: Midnight, Ocean, Sunset, Forest, Noir, Fire
- 🎙️ **TTS Voiceover**: edge-tts (free) or Qwen3 TTS (natural voice)
- 📐 **Vertical Format**: 1080×1920 (9:16) for Reels/TikTok/Shorts
- ⚡ **Spring Animations**: Physics-based motion (slide, fade, scale, typewriter)
- 🔧 **CLI Rendering**: `node render.mjs --config scenes.json`
- 💰 **Cost: $0.00 per video** (only LLM for script generation)

## Quick Start

```bash
npm install
node render.mjs --config examples/demo.json --output out/video.mp4
```

## Scene Types

| Template | Description | Props |
|----------|-------------|-------|
| `intro` | Dramatic hook with ring animation | `hook`, `subtitle` |
| `kinetic-text` | Words flying in with spring physics | `lines[]`, `accentLineIndex`, `animation` |
| `stat-card` | Animated number counters | `title`, `stats[{value, label}]` |
| `list-reveal` | Items appearing one by one | `title`, `items[]`, `icon`, `numbered` |
| `quote-card` | Testimonial with quotation mark | `quote`, `author`, `role` |
| `cta` | Pulsing call-to-action button | `headline`, `subtext`, `buttonText` |

## Config Format

```json
{
  "scenes": [
    {
      "type": "intro",
      "duration": 90,
      "props": {
        "hook": "Stop scrolling.",
        "subtitle": "This changes everything"
      }
    }
  ],
  "theme": {
    "name": "Midnight",
    "bgGradient": ["#0f0c29", "#302b63"],
    "textColor": "#ffffff",
    "accentColor": "#f5576c",
    "fontFamily": "sans-serif"
  }
}
```

Duration is in frames (30fps). So `90` = 3 seconds.

## Architecture

```
JSON Config → Remotion (React) → Frame-by-frame render → MP4
                                        ↓
                               edge-tts / Qwen3 TTS → Voiceover
                                        ↓
                               FFmpeg → Final MP4 with audio
```

## Adding TTS Voiceover

```bash
# Generate narration
edge-tts --voice 'en-US-GuyNeural' --text "Your narration" --write-media audio.mp3

# Merge with video
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac -shortest final.mp4
```

## Stack

- **Remotion** — React-based video rendering
- **edge-tts** — Free Microsoft TTS (300+ voices)
- **FFmpeg** — Audio/video processing
- **OpenAI** — Content generation (via n8n workflow)

## License

MIT
