"""Shared constants and small helpers."""
import hashlib
import os
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCENES_DIR = ROOT / "scenes"
FONTS_DIR = ROOT / "assets" / "fonts"
BUILD_ROOT = ROOT / "build"

W, H, FPS = 1920, 1080, 30


def ffmpeg_exe():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found: install it or `pip install imageio-ffmpeg`")


def env(name, required=True):
    value = os.environ.get(name, "")
    if required and not value:
        sys.exit(f"missing environment variable {name} (see .env.example)")
    return value


def sha256_file(path, chunk=1 << 20):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while block := f.read(chunk):
            h.update(block)
    return h.hexdigest()


def sha256_text(*parts):
    h = hashlib.sha256()
    for part in parts:
        h.update(part.encode() if isinstance(part, str) else part)
        h.update(b"\0")
    return h.hexdigest()
