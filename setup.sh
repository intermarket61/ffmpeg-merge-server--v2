#!/usr/bin/env bash
# Install the pipeline's dependencies. Safe to re-run.
set -euo pipefail
cd "$(dirname "$0")"
python3 -m pip install -q -r requirements.txt
# Chromium for Playwright; skipped where a browser is already provided
if [ -z "${PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD:-}" ]; then
  python3 -m playwright install --with-deps chromium
fi
python3 -c "import imageio_ffmpeg; print('ffmpeg:', imageio_ffmpeg.get_ffmpeg_exe())"
echo "ready: python -m engine status videos/video-a"
