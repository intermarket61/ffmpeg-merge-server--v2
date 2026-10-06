"""Lip-sync the presenter photo to each part's voice track with Hedra.

Each part's take is recorded in build/<id>/hedra/<part>.json with the hash
of the voice track it was made from. A take is reused while that hash
matches; a queued generation is resumed after a restart instead of paid for
twice; and nothing is spent without yes=True.
"""
import json
import mimetypes
import time
import urllib.error
import urllib.request
import uuid

from . import mix
from .util import env

API = "https://api.hedra.com/web-app/public"
DEFAULTS = {
    "model": "d1dd37a3-e39a-4854-a298-6510289f9cf2",    # Hedra Character 3
    "resolution": "1080p",
    "credits_per_second": 8.75,                          # 7/s x 1.25 at 1080p
    "prompt": ("A confident presenter speaking directly to camera, calm and "
               "conversational, natural head movement and blinking."),
}


def cfg(video):
    return {**DEFAULTS, **video.meta.get("hedra", {})}


def call(method, path, body=None, files=None):
    headers = {"X-API-Key": env("HEDRA_API_KEY")}
    data = None
    if files:
        boundary = uuid.uuid4().hex
        name, blob = files
        ctype = mimetypes.guess_type(name)[0] or "application/octet-stream"
        data = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; "
                f"filename=\"{name}\"\r\nContent-Type: {ctype}\r\n\r\n").encode() + blob + \
            f"\r\n--{boundary}--\r\n".encode()
        headers["Content-Type"] = f"multipart/form-data; boundary={boundary}"
    elif body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(API + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise SystemExit(f"Hedra {method} {path}: {e.code} {e.read().decode()[:500]}")


def upload(path, kind):
    asset = call("POST", "/assets", {"name": path.name, "type": kind})
    call("POST", f"/assets/{asset['id']}/upload", files=(path.name, path.read_bytes()))
    return asset["id"]


def paths(video, part):
    d = video.build / "hedra"
    d.mkdir(parents=True, exist_ok=True)
    return d / f"{part}.mp4", d / f"{part}.json"


def status(video):
    """Per part: 'ready', 'pending' (queued, resumable), 'stale' or 'missing'.
    Empty for a presenter-free video."""
    out = {}
    if not video.uses_hedra:
        return out
    for part in video.parts:
        take, meta_path = paths(video, part)
        _, sha = mix.part_track_sha(video, part)
        meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}
        if sha is None:
            out[part] = "unvoiced"
        elif meta.get("audio_sha") != sha:
            out[part] = "stale" if take.exists() else "missing"
        elif take.exists():
            out[part] = "ready"
        else:
            out[part] = "pending" if meta.get("generation_id") else "missing"
    return out


def estimate(video, parts):
    rate = cfg(video)["credits_per_second"]
    return round(sum(video.part_lengths[p] for p in parts) * rate)


def generate(video, part):
    c = cfg(video)
    take, meta_path = paths(video, part)
    track, sha = mix.part_track_sha(video, part)
    image_id = upload(video.presenter, "image")
    audio_id = upload(track, "audio")
    gen = call("POST", "/generations", {
        "type": "video",
        "ai_model_id": c["model"],
        "start_keyframe_id": image_id,
        "audio_id": audio_id,
        "generated_video_inputs": {"text_prompt": c["prompt"], "resolution": c["resolution"],
                                   "aspect_ratio": "16:9"},
    })
    # record the id before waiting, so a restart resumes instead of paying again
    meta_path.write_text(json.dumps({"audio_sha": sha, "generation_id": gen["id"]}))
    print(f"  {part}: generation {gen['id']} queued", flush=True)
    return gen["id"]


def wait(video, part):
    take, meta_path = paths(video, part)
    meta = json.loads(meta_path.read_text())
    while True:
        st = call("GET", f"/generations/{meta['generation_id']}/status")
        if st.get("status") == "complete":
            break
        if st.get("status") == "error":
            meta_path.unlink()
            raise SystemExit(f"Hedra failed on {part}: {st.get('error_message') or st}")
        time.sleep(20)
    urllib.request.urlretrieve(st.get("download_url") or st["url"], take)
    print(f"  {part}: take downloaded -> {video.rel(take)}", flush=True)


def run(video, yes=False):
    """Bring every part's take up to date. Parts generate in parallel."""
    if not video.uses_hedra:
        return []
    st = status(video)
    if "unvoiced" in st.values():
        raise SystemExit("voice every shot before making Hedra takes")
    to_make = [p for p, s in st.items() if s in ("missing", "stale")]
    to_wait = [p for p, s in st.items() if s == "pending"] + to_make
    if to_make:
        credits = estimate(video, to_make)
        if not yes:
            raise SystemExit(f"Hedra takes needed for {', '.join(to_make)}: about {credits} "
                             "credits. Re-run with --yes to spend them.")
        print(f"  generating {', '.join(to_make)} (~{credits} credits)", flush=True)
        for part in to_make:
            generate(video, part)
    for part in to_wait:
        wait(video, part)
    return to_wait
