"""Render shots: each shot is loaded into headless Chromium, stepped frame by
frame with that moment's Hedra frame handed in, screenshotted, and piped
into ffmpeg as its own clip.

Every clip is stamped with a hash of everything that shaped it (its spec,
the scene code, the face take). A shot is re-rendered only when that hash
changes, so editing one scene or one shot re-renders just what it touches.
"""
import base64
import json
import subprocess
from concurrent.futures import ProcessPoolExecutor

from .util import FPS, H, SCENES_DIR, W, ffmpeg_exe, sha256_text
from .video import Video

WORKERS = 3


def take_for(shot):
    return shot.video.build / "hedra" / f"{shot.part}.mp4"


def stamp(shot, index, count):
    video = shot.video
    code = [(SCENES_DIR / "index.html").read_text(), (SCENES_DIR / "runtime.js").read_text()]
    code += [p.read_text() for p in video.scene_files()]
    meta = video.build / "hedra" / f"{shot.part}.json"
    take = json.loads(meta.read_text()).get("audio_sha", "") if take_for(shot).exists() and meta.exists() else "no-take"
    spec = json.dumps(shot.spec(index == 0, index == count - 1), sort_keys=True)
    return sha256_text(spec, f"{shot.length:.4f}|{shot.part_offset:.4f}", take, *code)


def clip(shot):
    return shot.video.build / "shots" / f"{shot.key}.mp4"


def stale(video):
    out = []
    for i, shot in enumerate(video.shots):
        s = clip(shot).with_suffix(".stamp")
        if not clip(shot).exists() or not s.exists() or s.read_text() != stamp(shot, i, len(video.shots)):
            out.append(shot.key)
    return out


def face_frames(ff, shot):
    """Hedra frames for this shot as JPEG data URLs, one per output frame."""
    take = take_for(shot)
    if not take.exists():
        while True:
            yield None
    proc = subprocess.Popen(
        [ff, "-loglevel", "error", "-ss", f"{shot.part_offset:.3f}", "-i", str(take),
         "-t", f"{shot.duration:.3f}", "-vf", f"fps={FPS}", "-q:v", "3",
         "-f", "image2pipe", "-c:v", "mjpeg", "-"],
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    buf, last = b"", None
    while True:
        chunk = proc.stdout.read(1 << 16)
        if chunk:
            buf += chunk
        while True:                         # split on JPEG end-of-image markers
            end = buf.find(b"\xff\xd9")
            if end < 0:
                break
            last = "data:image/jpeg;base64," + base64.b64encode(buf[:end + 2]).decode()
            buf = buf[end + 2:]
            yield last
        if not chunk:
            break
    proc.wait()
    while True:                             # past the end of the take: hold last frame
        yield last


def open_page(playwright, video):
    browser = playwright.chromium.launch(args=["--allow-file-access-from-files"])
    page = browser.new_page(viewport={"width": W, "height": H})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto((SCENES_DIR / "index.html").as_uri())
    page.add_script_tag(path=str(SCENES_DIR / "runtime.js"))
    for f in video.scene_files():
        page.add_script_tag(path=str(f))
    if errors:
        raise RuntimeError(f"scene scripts failed to load: {errors[0]}")
    return browser, page


def render_shot(args):
    from playwright.sync_api import sync_playwright

    video_dir, index = args
    video = Video(video_dir)
    shot = video.shots[index]
    ff = ffmpeg_exe()
    out = clip(shot)
    out.parent.mkdir(parents=True, exist_ok=True)
    n = round(shot.length * FPS)
    tmp = out.with_suffix(".part.mp4")
    enc = subprocess.Popen(
        [ff, "-y", "-loglevel", "error", "-f", "image2pipe", "-c:v", "mjpeg", "-r", str(FPS),
         "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p",
         "-r", str(FPS), str(tmp)], stdin=subprocess.PIPE)
    faces = face_frames(ff, shot)
    with sync_playwright() as p:
        browser, page = open_page(p, video)
        page.evaluate("s => setup(s)", shot.spec(index == 0, index == len(video.shots) - 1))
        for f in range(n):
            page.evaluate("f => setFace(f)", next(faces))
            page.evaluate("([t, f]) => seek(t, f)", [f / FPS, f])
            enc.stdin.write(page.screenshot(type="jpeg", quality=93))
        browser.close()
    enc.stdin.close()
    if enc.wait() != 0:
        raise RuntimeError(f"ffmpeg failed on shot {shot.key}")
    tmp.replace(out)                        # only a finished clip ever lands at out
    out.with_suffix(".stamp").write_text(stamp(shot, index, len(video.shots)))
    return f"  rendered {shot.key}: {shot.length:5.1f}s  {n} frames"


def run(video, only=None, force=False):
    """Render stale shots (or `only`, or everything with force)."""
    keys = set(only) if only else ({s.key for s in video.shots} if force else set(stale(video)))
    todo = [i for i, s in enumerate(video.shots) if s.key in keys]
    todo.sort(key=lambda i: -video.shots[i].length)     # longest first
    if not todo:
        return []
    with ProcessPoolExecutor(WORKERS) as pool:
        for line in pool.map(render_shot, [(str(video.dir), i) for i in todo]):
            print(line, flush=True)
    return [video.shots[i].key for i in todo]


def stills(video, keys, at=0.6, out_dir=None):
    """One frame per shot (at a fraction of its length) for quick review,
    using the real face take when there is one and the presenter photo
    when there isn't (so framing can be judged before paying for a take)."""
    from playwright.sync_api import sync_playwright

    ff = ffmpeg_exe()
    out_dir = out_dir or video.build / "stills"
    out_dir.mkdir(parents=True, exist_ok=True)
    outs = []
    photo = "data:image/webp;base64," + base64.b64encode(video.presenter.read_bytes()).decode()
    with sync_playwright() as p:
        browser, page = open_page(p, video)
        for i, shot in enumerate(video.shots):
            if shot.key not in keys:
                continue
            t = shot.length * at
            face = photo
            if take_for(shot).exists():
                jpg = subprocess.run([ff, "-loglevel", "error", "-ss", f"{shot.part_offset + t:.3f}",
                                      "-i", str(take_for(shot)), "-frames:v", "1", "-f", "image2pipe",
                                      "-c:v", "mjpeg", "-"], capture_output=True).stdout
                face = "data:image/jpeg;base64," + base64.b64encode(jpg).decode()
            page.evaluate("s => setup(s)", shot.spec(i == 0, i == len(video.shots) - 1))
            page.evaluate("f => setFace(f)", face)
            page.evaluate("([t, f]) => seek(t, f)", [t, int(t * FPS)])
            path = out_dir / f"{shot.key}.jpg"
            page.screenshot(path=str(path), type="jpeg", quality=85)
            outs.append(path)
        browser.close()
    return outs
