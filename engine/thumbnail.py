"""The YouTube thumbnail: one still rendered from video.json "thumbnail".

    "thumbnail": {"shot": "b3", "t": 4.2,          # the face: this moment of that shot's take
                  "scene": "thumbnail",             # optional, the library scene by default
                  "params": {"kicker": "...", "lines": [{"html": "..."}], "badge": "..."}}

Written to build/<id>/thumbnail.jpg at 1280x720 (YouTube's size, under its
2 MB limit). Before a Hedra take exists the presenter photo stands in, so
the layout can be reviewed with the stills.
"""
import base64
import subprocess

from .render import open_page, take_for
from .util import ffmpeg_exe

MAX_BYTES = 2 * 1024 * 1024


def path(video):
    return video.build / "thumbnail.jpg"


def make(video):
    """Render the thumbnail; returns its path, or None if video.json has none."""
    from playwright.sync_api import sync_playwright

    th = video.meta.get("thumbnail")
    if not th:
        return None
    shot = video.shot(th["shot"])
    ff = ffmpeg_exe()
    face = "data:image/webp;base64," + base64.b64encode(video.presenter.read_bytes()).decode()
    if take_for(shot).exists():
        jpg = subprocess.run([ff, "-loglevel", "error", "-ss", f"{shot.part_offset + th.get('t', 0):.3f}",
                              "-i", str(take_for(shot)), "-frames:v", "1", "-q:v", "2",
                              "-f", "image2pipe", "-c:v", "mjpeg", "-"], capture_output=True).stdout
        face = "data:image/jpeg;base64," + base64.b64encode(jpg).decode()
    spec = {"key": "thumbnail", "scene": th.get("scene", "thumbnail"), "duration": 1.0,
            "lines": [], "words": [], "fadeIn": False, "fadeOut": False,
            "params": {**video.meta.get("params", {}), "grain": 0, **th.get("params", {})}}
    out = path(video)
    out.parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser, page = open_page(p, video)
        page.evaluate("s => setup(s)", spec)
        page.evaluate("f => setFace(f)", face)
        page.evaluate("([t, f]) => seek(t, f)", [0, 0])
        png = page.screenshot(type="png")
        browser.close()
    for q in (2, 4, 7):                     # step quality down only if over YouTube's limit
        subprocess.run([ff, "-loglevel", "error", "-y", "-f", "image2pipe", "-i", "-",
                        "-vf", "scale=1280:720", "-q:v", str(q), str(out)], input=png, check=True)
        if out.stat().st_size < MAX_BYTES:
            break
    return out
