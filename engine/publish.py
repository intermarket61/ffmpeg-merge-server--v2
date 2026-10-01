"""Publish a finished cut: S3 and a private YouTube upload.

S3 (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET, S3_PREFIX)
    s3://<bucket>/<prefix><id>/<id>.mp4, <id>.srt, thumbnail.jpg, youtube.json, shorts/
    (exactly what was sent to YouTube), and assets/ (the voice and Hedra
    takes, the paid-for parts) so the video can be re-cut anywhere.

YouTube (YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN)
    Uploads as private, flagged as containing synthetic media (AI voice and
    lip-sync), with the metadata from engine/metadata.py (video.json
    "youtube" plus chapters from shots.json), the captions and the
    thumbnail. Later changes to the metadata or thumbnail are pushed to the
    same video, unless its title or description was edited in YouTube
    Studio since we last set them: then publish warns and leaves it alone.
    Custom thumbnails need a verified channel (youtube.com/verify).
    "publish_at" (video.json "youtube", and each Short) schedules the
    release: the video stays private until then and YouTube makes it public.
    Changing it later reschedules; a video already public is left alone. Get the
    refresh token once with tools/youtube_auth.py on your own computer.

What was published is recorded in build/<id>/publish.json, and re-running
skips anything already done, so a video is never uploaded twice.
"""
import json
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

from . import metadata, shorts, thumbnail
from .util import env, sha256_file

TOKEN_URL = "https://oauth2.googleapis.com/token"
UPLOAD_URL = "https://www.googleapis.com/upload/youtube/v3/videos"
CAPTIONS_URL = "https://www.googleapis.com/upload/youtube/v3/captions"
THUMB_URL = "https://www.googleapis.com/upload/youtube/v3/thumbnails/set"
VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"
CHUNK = 32 * 1024 * 1024


def record_path(video):
    return video.build / "publish.json"


def load_record(video):
    p = record_path(video)
    return json.loads(p.read_text()) if p.exists() else {}


def save_record(video, rec):
    record_path(video).write_text(json.dumps(rec, indent=2))


# ------------------------------------------------------------------ S3

def to_s3(video, rec):
    import boto3

    bucket = env("S3_BUCKET")
    prefix = env("S3_PREFIX", required=False) or ""
    base = f"{prefix}{video.id}/"
    s3 = boto3.client("s3", region_name=env("AWS_REGION"))
    files = [(video.final, "video/mp4"), (video.captions, "application/x-subrip")]
    files += [(p, t) for p, t in ((thumbnail.path(video), "image/jpeg"),
                                  (meta_path(video), "application/json")) if p.exists()]
    files += [(p, "video/mp4") for p in sorted(shorts.out_dir(video).glob("*.mp4"))]
    files += [(p, "audio/mpeg") for p in sorted((video.build / "vo").glob("*.mp3"))]
    files += [(p, "application/json") for p in sorted((video.build / "vo").glob("*.json"))]
    files += [(p, "video/mp4") for p in sorted((video.build / "hedra").glob("*.mp4"))]
    files += [(p, "application/json") for p in sorted((video.build / "hedra").glob("*.json"))]
    done = rec.setdefault("s3", {})
    for path, ctype in files:
        rel = (path.name if path.parent == video.build else
               f"shorts/{path.name}" if path.parent == shorts.out_dir(video) else
               f"assets/{path.parent.name}/{path.name}")
        key = base + rel
        sha = sha256_file(path)
        if done.get(key) == sha:
            continue
        print(f"  s3 <- {rel} ({path.stat().st_size / 2**20:.1f} MiB)", flush=True)
        s3.upload_file(str(path), bucket, key, ExtraArgs={"ContentType": ctype})
        done[key] = sha
        save_record(video, rec)
    rec["s3_url"] = f"s3://{bucket}/{base}{video.final.name}"
    save_record(video, rec)
    print(f"  s3: {rec['s3_url']}")


# ------------------------------------------------------------------ YouTube

def access_token():
    body = urllib.parse.urlencode({
        "client_id": env("YOUTUBE_CLIENT_ID"), "client_secret": env("YOUTUBE_CLIENT_SECRET"),
        "refresh_token": env("YOUTUBE_REFRESH_TOKEN"), "grant_type": "refresh_token",
    }).encode()
    return json.load(urllib.request.urlopen(TOKEN_URL, data=body))["access_token"]


def request(method, url, token, data=None, headers=None):
    req = urllib.request.Request(url, data=data, method=method,
                                 headers={"Authorization": f"Bearer {token}", **(headers or {})})
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, dict(r.headers), r.read()
    except urllib.error.HTTPError as e:
        if e.code == 308:                    # resumable upload: chunk accepted
            return 308, dict(e.headers), b""
        raise SystemExit(f"YouTube {method} {url.split('?')[0]}: {e.code} {e.read().decode()[:600]}")


def upload_video(video, token):
    when = metadata.publish_time(video.meta.get("youtube", {}).get("publish_at"))
    return upload_file(video, video.final, metadata.youtube(video), token, when)


def upload_file(video, path, snippet, token, publish_at=None):
    yt = video.meta.get("youtube", {})
    meta = {
        "snippet": snippet,
        "status": {"privacyStatus": yt.get("privacy", "private"),
                   "selfDeclaredMadeForKids": False,
                   "containsSyntheticMedia": yt.get("synthetic_media", True)},
    }
    if publish_at:
        meta["status"].update(privacyStatus="private", publishAt=publish_at)
    size = path.stat().st_size
    _, headers, _ = request(
        "POST", f"{UPLOAD_URL}?uploadType=resumable&part=snippet,status", token,
        data=json.dumps(meta).encode(),
        headers={"Content-Type": "application/json; charset=UTF-8",
                 "X-Upload-Content-Length": str(size), "X-Upload-Content-Type": "video/mp4"})
    session = headers.get("Location") or headers.get("location")
    sent = 0
    with open(path, "rb") as f:
        while sent < size:
            chunk = f.read(CHUNK)
            end = sent + len(chunk) - 1
            for attempt in range(5):
                try:
                    status, h, body = request("PUT", session, token, data=chunk, headers={
                        "Content-Length": str(len(chunk)),
                        "Content-Range": f"bytes {sent}-{end}/{size}"})
                    break
                except (urllib.error.URLError, ConnectionError, TimeoutError):
                    time.sleep(2 ** attempt)
            else:
                raise SystemExit("YouTube upload kept failing; re-run publish to retry")
            sent = end + 1
            print(f"  youtube: {sent / size:5.1%}", flush=True)
    return json.loads(body)["id"]


def upload_captions(video, token, video_id):
    yt = video.meta.get("youtube", {})
    boundary = uuid.uuid4().hex
    meta = {"snippet": {"videoId": video_id, "language": yt.get("language", "en"),
                        "name": "English", "isDraft": False}}
    body = (f"--{boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n"
            f"{json.dumps(meta)}\r\n--{boundary}\r\nContent-Type: application/octet-stream\r\n\r\n"
            ).encode() + video.captions.read_bytes() + f"\r\n--{boundary}--\r\n".encode()
    request("POST", f"{CAPTIONS_URL}?uploadType=multipart&part=snippet", token, data=body,
            headers={"Content-Type": f"multipart/related; boundary={boundary}"})


def meta_path(video):
    return video.build / "youtube.json"


def sync_metadata(video, token, yt):
    """Push changed metadata to the uploaded video, never over edits made in Studio."""
    want = metadata.youtube(video)
    if yt.get("sent") == want:
        return
    last = yt.get("sent")                    # what we last set on YouTube
    if not last:
        print("  youtube: no record of what was last sent; not changing title or description")
        return
    _, _, body = request("GET", f"{VIDEOS_URL}?part=snippet&id={yt['video_id']}", token)
    live = json.loads(body)["items"][0]["snippet"]
    if (live.get("title"), live.get("description", "")) != (last["title"], last["description"]):
        print("  youtube: title or description was edited in Studio; not overwriting it")
        return
    request("PUT", f"{VIDEOS_URL}?part=snippet", token,
            data=json.dumps({"id": yt["video_id"], "snippet": want}).encode(),
            headers={"Content-Type": "application/json; charset=UTF-8"})
    yt["sent"] = want
    print("  youtube: metadata updated")


def set_thumbnail(video, token, yt):
    path = thumbnail.path(video)
    if not path.exists():
        return
    sha = sha256_file(path)
    if yt.get("thumbnail_sha") == sha:
        return
    try:
        request("POST", f"{THUMB_URL}?videoId={yt['video_id']}", token, data=path.read_bytes(),
                headers={"Content-Type": "image/jpeg"})
    except SystemExit as e:                  # most often: channel not verified for custom thumbnails
        print(f"  youtube: thumbnail not set ({e}); it is in S3 to upload by hand")
        return
    yt["thumbnail_sha"] = sha
    print("  youtube: thumbnail set")


STATUS_FIELDS = ("privacyStatus", "embeddable", "license", "publicStatsViewable", "publishAt",
                 "selfDeclaredMadeForKids", "containsSyntheticMedia")


def schedule(token, entry, when, name):
    """Set (or move) an uploaded video's release time, keeping its other status settings."""
    if not when or entry.get("publish_at") == when:
        return
    from datetime import datetime, timezone
    if datetime.strptime(when, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc) <= datetime.now(timezone.utc):
        print(f"  youtube: {name}: {when} is in the past; not scheduling")
        return
    _, _, body = request("GET", f"{VIDEOS_URL}?part=status&id={entry['video_id']}", token)
    status = json.loads(body)["items"][0]["status"]
    if status.get("privacyStatus") != "private":
        print(f"  youtube: {name} is already {status.get('privacyStatus')}; not scheduling")
        return
    status = {k: v for k, v in status.items() if k in STATUS_FIELDS}
    status.update(privacyStatus="private", publishAt=when)
    request("PUT", f"{VIDEOS_URL}?part=status", token,
            data=json.dumps({"id": entry["video_id"], "status": status}).encode(),
            headers={"Content-Type": "application/json; charset=UTF-8"})
    entry["publish_at"] = when
    print(f"  youtube: {name} scheduled for {when}")


def to_youtube_shorts(video, rec):
    done = rec.setdefault("shorts", {})
    for short in video.meta.get("shorts", []):
        path = shorts.path(video, short)
        if not path.exists():
            continue
        sha = sha256_file(path)
        when = metadata.publish_time(short.get("publish_at"))
        if done.get(short["id"], {}).get("video_sha") == sha:
            schedule(access_token(), done[short["id"]], when, f"short {short['id']}")
            save_record(video, rec)
            continue
        snippet = metadata.short(video, short, rec.get("youtube", {}).get("video_id"))
        if done.get(short["id"]):
            print(f"  youtube: short {short['id']} changed since upload; uploading a new private one")
        vid = upload_file(video, path, snippet, access_token(), when)
        done[short["id"]] = {"video_id": vid, "video_sha": sha, "sent": snippet, "publish_at": when}
        save_record(video, rec)
        print(f"  youtube: short {short['id']} https://youtube.com/shorts/{vid} (private"
              f"{', public at ' + when if when else ''})")


def to_youtube(video, rec):
    yt = rec.setdefault("youtube", {})
    sha = sha256_file(video.final)
    if yt.get("video_sha") == sha and yt.get("video_id"):
        print(f"  youtube: already uploaded https://youtu.be/{yt['video_id']}")
    else:
        if yt.get("video_id"):
            print(f"  youtube: cut changed since upload {yt['video_id']}; uploading a new private video")
        token = access_token()
        yt.update(video_id=upload_video(video, token), video_sha=sha, captions=False,
                  sent=metadata.youtube(video), thumbnail_sha=None)
        save_record(video, rec)
    if not yt.get("captions"):
        upload_captions(video, access_token(), yt["video_id"])
        yt["captions"] = True
        save_record(video, rec)
    token = access_token()
    sync_metadata(video, token, yt)
    set_thumbnail(video, token, yt)
    schedule(token, yt, metadata.publish_time(video.meta.get("youtube", {}).get("publish_at")), "video")
    save_record(video, rec)
    print(f"  youtube: https://studio.youtube.com/video/{yt['video_id']}/edit (private)")


def run(video, s3=True, youtube=True):
    if not video.final.exists():
        raise SystemExit("nothing to publish: run make (or merge) first")
    rec = load_record(video)
    shorts.make(video)
    if thumbnail.make(video):
        print(f"  thumbnail -> {video.rel(thumbnail.path(video))}")
    meta_path(video).write_text(json.dumps(metadata.youtube(video), indent=2, ensure_ascii=False))
    if s3:
        to_s3(video, rec)
    if youtube:
        to_youtube(video, rec)
        to_youtube_shorts(video, rec)
