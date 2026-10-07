=============================================================================
BACKGROUND VIDEO ASSETS DIRECTORY
=============================================================================

Place your background video files in this directory:
- static/videos/background.mp4   (Universal format: H.264 codec, AAC or no audio, compressed)
- static/videos/background.webm  (Optional high-compression format: VP9/AV1 codec for modern browsers)
- static/videos/iris_background_poster.jpg (Fallback poster image for pre-load and reduced-motion)

RECOMMENDED VIDEO ENCODING SETTINGS FOR WEB:
- Codec: H.264 (for MP4) / VP9 or AV1 (for WebM)
- Resolution: 1080p (1920x1080) or 720p (1280x720)
- Frame Rate: 24fps or 30fps
- Target Bitrate: 1.5 - 2.5 Mbps (keep file size under 5 - 10 MB for fast load times)
- Audio: None / Strip audio tracks entirely to reduce file size
- Faststart / Web-optimized: ffmpeg -i input.mp4 -vcodec libx264 -crf 26 -an -movflags +faststart background.mp4
