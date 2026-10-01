"""Vertical Shorts cut from the finished video, set up in video.json:

    "shorts": [{"id": "inject", "from": "i2", "to": "i6", "label": "Prompt injection",
                "title": "...", "description": "...", "tags": [...]}]

A Short is a run of consecutive shots, rebuilt at 1080x1920 rather than
cropped (a crop would cut the graphics in half): the cut's frame on top with
the presenter's Hedra take below, or the take full frame for shots that are
only the presenter, with word-by-word captions from the voice timings. The
audio is the same stretch of the finished cut, so it costs no credits.

Written to build/<id>/shorts/<short id>.mp4; a Short is remade only when its
spec, the cut or the page changes.
"""
import base64
import json
import re
import subprocess

from .render import take_for
from .util import FPS, SCENES_DIR, ffmpeg_exe, sha256_file, sha256_text

W, H = 1080, 1920
# shots that are the presenter full frame (in the cut, text over the face), so a
# split would show him twice: these go full frame in a Short, from the time given
FACE_SCENES = {"presenter": 0, "presenterWords": 0, "presenterFive": 0, "failureTitle": 3.8}
MAX_WORDS = 3                               # words per caption


def out_dir(video):
    return video.build / "shorts"


def path(video, short):
    return out_dir(video) / f"{short['id']}.mp4"


def span(video, short):
    keys = [s.key for s in video.shots]
    shots = video.shots[keys.index(short["from"]):keys.index(short["to"]) + 1]
    if not shots:
        raise SystemExit(f"short {short['id']}: {short['to']} comes before {short['from']}")
    return shots


def captions(shots):
    """[(start, end, [words])] in Short time, a few words at a time."""
    words, clock = [], 0.0
    for shot in shots:
        for w in shot.words:
            text = re.sub(r"[.,;:]+$", "", w["w"].strip("“”\""))
            if text and text not in ("—", "-"):
                words.append((clock + w["t0"], clock + w["t1"], text, w["w"][-1:] in ".,;:?!—"))
        clock += shot.length
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        gap = words[i + 1][0] - w[1] if i + 1 < len(words) else 9
        if len(cur) == MAX_WORDS or w[3] or gap > 0.6:
            chunks.append(cur)
            cur = []
    if cur:
        chunks.append(cur)
    out = []
    for i, c in enumerate(chunks):
        end = min(chunks[i + 1][0][0], c[-1][1] + 0.5) if i + 1 < len(chunks) else c[-1][1] + 0.5
        out.append((c[0][0], end, c))
    return out


def frames(ff, src, start, dur):
    """JPEG data URLs of src from start, one per output frame (last one held)."""
    proc = subprocess.Popen([ff, "-loglevel", "error", "-ss", f"{start:.3f}", "-i", str(src), "-t", f"{dur:.3f}",
                             "-vf", f"fps={FPS}", "-q:v", "3", "-f", "image2pipe", "-c:v", "mjpeg", "-"],
                            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    buf, last = b"", None
    while True:
        chunk = proc.stdout.read(1 << 16)
        buf += chunk
        while (end := buf.find(b"\xff\xd9")) >= 0:
            last = "data:image/jpeg;base64," + base64.b64encode(buf[:end + 2]).decode()
            buf = buf[end + 2:]
            yield last
        if not chunk:
            break
    proc.wait()
    while True:
        yield last


def stamp(video, short):
    page = (SCENES_DIR / "short.html").read_text()
    return sha256_text(json.dumps(short, sort_keys=True), sha256_file(video.final), page,
                       *(open(__file__).read(),))


def make_one(video, short):
    from playwright.sync_api import sync_playwright

    shots = span(video, short)
    start, total = shots[0].offset, sum(s.length for s in shots)
    n = round(total * FPS)
    ff = ffmpeg_exe()
    out = path(video, short)
    out.parent.mkdir(parents=True, exist_ok=True)
    silent = out.with_suffix(".video.mp4")
    enc = subprocess.Popen([ff, "-y", "-loglevel", "error", "-f", "image2pipe", "-c:v", "mjpeg", "-r", str(FPS),
                            "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                            "-pix_fmt", "yuv420p", str(silent)], stdin=subprocess.PIPE)
    cut = frames(ff, video.final, start, total)
    caps = captions(shots)
    accent = video.meta.get("params", {}).get("accent")
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--allow-file-access-from-files"])
        page = browser.new_page(viewport={"width": W, "height": H})
        page.goto((SCENES_DIR / "short.html").as_uri())
        page.evaluate("document.fonts.ready.then(()=>true)")
        f, shot_start = 0, 0.0
        for shot in shots:
            face_from = FACE_SCENES.get(shot.scene)
            face = frames(ff, take_for(shot), shot.part_offset, shot.length)
            for _ in range(round((shot_start + shot.length) * FPS) - f):
                if f >= n:
                    break
                t = f / FPS
                mode = "face" if face_from is not None and t - shot_start >= face_from else "split"
                chunk = next((c for c in caps if c[0] <= t < c[1]), None)
                words = [w[2] for w in chunk[2]] if chunk else []
                current = max((i for i, w in enumerate(chunk[2]) if w[0] <= t), default=0) if chunk else -1
                page.evaluate("f => show(f)", {"mode": mode, "graphic": next(cut), "face": next(face),
                                               "label": short.get("label", ""), "words": words,
                                               "current": current, "accent": accent})
                enc.stdin.write(page.screenshot(type="jpeg", quality=92))
                f += 1
            shot_start += shot.length
        browser.close()
    enc.stdin.close()
    if enc.wait() != 0:
        raise RuntimeError(f"ffmpeg failed on short {short['id']}")
    fade = max(total - 0.3, 0)
    subprocess.run([ff, "-y", "-loglevel", "error", "-i", str(silent), "-ss", f"{start:.3f}", "-t", f"{total:.3f}",
                    "-i", str(video.final), "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-af", f"afade=t=in:d=0.15,afade=t=out:st={fade:.3f}:d=0.3", "-c:a", "aac", "-b:a", "192k",
                    "-shortest", "-movflags", "+faststart", str(out)], check=True)
    silent.unlink()
    out.with_suffix(".stamp").write_text(stamp(video, short))
    return out


def make(video):
    """Make every Short that is missing or out of date; returns the paths of all of them."""
    outs = []
    for short in video.meta.get("shorts", []):
        out = path(video, short)
        st = out.with_suffix(".stamp")
        if not (out.exists() and st.exists() and st.read_text() == stamp(video, short)):
            make_one(video, short)
            print(f"  short {short['id']}: {video.rel(out)}", flush=True)
        outs.append(out)
    return outs
