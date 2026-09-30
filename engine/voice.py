"""Voice each shot with ElevenLabs, keeping character timestamps so shots and
graphics are timed to the actual read. A shot is re-voiced only when it has
no take yet or its lines changed (or when forced)."""
import base64
import json
import urllib.request

from .util import env

DEFAULT_MODEL = "eleven_multilingual_v2"


def voice_shot(video, shot):
    cfg = video.meta.get("voice", {})
    voice_id = cfg.get("voice_id") or env("ELEVENLABS_VOICE_ID")
    url = (f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
           "/with-timestamps?output_format=mp3_44100_128")
    body = {"text": shot.text, "model_id": cfg.get("model", DEFAULT_MODEL)}
    if "settings" in cfg:
        body["voice_settings"] = cfg["settings"]
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={"xi-api-key": env("ELEVENLABS_API_KEY"),
                                          "Content-Type": "application/json"})
    data = json.load(urllib.request.urlopen(req))
    shot.vo_mp3.parent.mkdir(parents=True, exist_ok=True)
    shot.vo_mp3.write_bytes(base64.b64decode(data["audio_base64"]))
    shot.vo_json.write_text(json.dumps({"text": shot.text, **data["alignment"]}))
    return data["alignment"]["character_end_times_seconds"][-1]


def run(video, only=None, force=False):
    """Voice what needs voicing; returns the keys voiced."""
    done = []
    for shot in video.shots:
        if not shot.lines or (only and shot.key not in only):
            continue
        if force or not shot.voiced:
            secs = voice_shot(video, shot)
            print(f"  voiced {shot.key}: {secs:.1f}s", flush=True)
            done.append(shot.key)
    if done:
        video.reload()
    return done
