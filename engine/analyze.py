"""Study the reference videos named in video.json "reference" and write a
style brief to videos/<id>/reference.md.

    "reference": {
      "channel": "https://www.youtube.com/@...",
      "videos": ["https://www.youtube.com/watch?v=...", ...],
      "model": "gemini-2.5-flash"          (optional)
    }

Free, always: oEmbed metadata (title, channel) and YouTube's thumbnails
(the cover plus three auto-sampled frames) into build/<id>/reference/<vid>/.

Paid, with --yes: Gemini watches each video from its URL (Google fetches
it, so this works where YouTube blocks direct downloads) at low media
resolution and returns a structured breakdown of format, pacing and look.
Token counts are free and printed first; one ~20-minute video is ~135k
tokens, a few US cents. Results are cached per video in analysis.json.

The brief is for learning the *format* (structure, pacing, shot rhythm,
audio). Gemini is told not to return the transcript, and nothing from the
reference is reused: scripts are original and the look is our own.
"""
import json
import re
import urllib.parse
import urllib.request

from . import gemini

DEFAULT_MODEL = "gemini-2.5-flash"
LOW_RES = {"mediaResolution": "MEDIA_RESOLUTION_LOW"}
# USD per million input tokens for the default model (video/image/text, audio)
PRICE = {"VIDEO": 0.30, "TEXT": 0.30, "IMAGE": 0.30, "AUDIO": 1.00, "OUTPUT": 2.50}

PROMPT = """You are a video editor studying the FORMAT of this YouTube video so a
different creator can learn its craft. Do NOT transcribe it or quote more than
a few words at a time. Return JSON only, with these keys:

"title", "duration_s",
"spoken_words_estimate", "words_per_minute",
"narration": {"person": "first/second/third", "tense", "tone", "delivery"},
"structure": [{"start": "m:ss", "end": "m:ss", "beat": "what this section does, in your words"}],
"devices": ["recurring storytelling devices, e.g. bookends, foil characters, running numbers"],
"visuals": {"medium", "line_and_shading", "palette": ["named colours"], "recurring_settings": [],
            "people": "how people are drawn and framed", "text_on_screen": "captions, cards, numbers"},
"editing": {"avg_image_hold_s", "camera_motion", "transitions", "section_cards"},
"audio": {"music", "sfx", "mix"},
"opening_hook": "how the first 30 s earns attention, described not quoted",
"closing": "how it ends and what it asks of the viewer, described not quoted",
"what_makes_it_work": ["3-6 craft lessons"]
"""




def vid_id(url):
    q = urllib.parse.urlparse(url)
    if q.hostname and "youtu.be" in q.hostname:
        return q.path.strip("/")
    return urllib.parse.parse_qs(q.query).get("v", [q.path.rsplit("/", 1)[-1]])[0]


def fetch(url, dest=None):
    with urllib.request.urlopen(url, timeout=60) as r:
        data = r.read()
    if dest:
        dest.write_bytes(data)
    return data


def free_pass(url, d):
    vid = vid_id(url)
    meta_p = d / "meta.json"
    if not meta_p.exists():
        meta = json.loads(fetch("https://www.youtube.com/oembed?format=json&url=" +
                                urllib.parse.quote(f"https://www.youtube.com/watch?v={vid}")))
        meta_p.write_text(json.dumps(meta, indent=2))
    for name in ("maxresdefault", "hq1", "hq2", "hq3"):
        p = d / f"{name}.jpg"
        if not p.exists():
            try:
                fetch(f"https://i.ytimg.com/vi/{vid}/{name}.jpg", p)
            except Exception as e:                       # thumbnails are a nice-to-have
                print(f"  {vid}: no {name} ({e})")
    return json.loads(meta_p.read_text())


def contents(url):
    return [{"parts": [{"file_data": {"file_uri": url}}, {"text": PROMPT}]}]


def cost(details, out_tokens=4000):
    return sum(PRICE.get(m, 0.30) * n for m, n in details.items()) / 1e6 + PRICE["OUTPUT"] * out_tokens / 1e6


def paid_pass(url, d, model):
    p = d / "analysis.json"
    if p.exists():
        return json.loads(p.read_text())
    resp = gemini.call(model, "generateContent", {
        "contents": contents(url),
        "generationConfig": {**LOW_RES, "responseMimeType": "application/json", "temperature": 0.2},
    })
    text = "".join(part.get("text", "") for part in resp["candidates"][0]["content"]["parts"])
    data = json.loads(re.sub(r"^```(json)?|```$", "", text.strip()))
    data["_usage"] = resp.get("usageMetadata", {})
    p.write_text(json.dumps(data, indent=2))
    return data


def run(video, yes=False):
    ref = video.meta.get("reference")
    if not ref or not ref.get("videos"):
        raise SystemExit('video.json has no "reference": {"videos": [...]}')
    model = ref.get("model", DEFAULT_MODEL)
    root = video.build / "reference"
    found = []
    for url in ref["videos"]:
        d = root / vid_id(url)
        d.mkdir(parents=True, exist_ok=True)
        meta = free_pass(url, d)
        found.append((url, d, meta))
        print(f"  {vid_id(url)}: {meta.get('title')} ({meta.get('author_name')})")

    todo = [(u, d, m) for u, d, m in found if not (d / "analysis.json").exists()]
    if todo:
        total = 0.0
        for url, d, meta in todo:
            n, det = gemini.count_tokens(model, contents(url), LOW_RES)
            total += cost(det)
            print(f"  {vid_id(url)}: {n:,} tokens to analyse with {model}")
        if not yes:
            print(f"analyze: Gemini pass for {len(todo)} video(s), about ${total:.2f}. "
                  "Re-run with --yes to spend it.")
            return write_brief(video, found, ref)
        for url, d, meta in todo:
            paid_pass(url, d, model)
            print(f"  {vid_id(url)}: analysed")
    return write_brief(video, found, ref)


def bullet(x):
    if isinstance(x, dict):
        return "; ".join(f"{k}: {bullet(v)}" for k, v in x.items())
    if isinstance(x, list):
        return ", ".join(bullet(v) for v in x)
    return str(x)


def write_brief(video, found, ref):
    out = [f"# Reference brief: {video.meta.get('title', video.id)}", "",
           "Generated by `python -m engine analyze`. This records the reference "
           "channel's *format* so we can learn its pacing and structure. We never reuse "
           "its words, characters, examples or look; see the video's own notes for how "
           "this video differs.", ""]
    if ref.get("channel"):
        out += [f"Channel: {ref['channel']}", ""]
    holds, wpms = [], []
    for url, d, meta in found:
        out += [f"## {meta.get('title')}", "", url, ""]
        a = d / "analysis.json"
        if not a.exists():
            out += ["_Not analysed yet (run `analyze --yes`)._", ""]
            continue
        a = json.loads(a.read_text())
        for k in ("duration_s", "spoken_words_estimate", "words_per_minute"):
            if k in a:
                out.append(f"* **{k.replace('_', ' ')}**: {a[k]}")
        try:
            wpms.append(float(a["words_per_minute"]))
            holds.append(float(a["editing"]["avg_image_hold_s"]))
        except (KeyError, TypeError, ValueError):
            pass
        for k in ("narration", "devices", "visuals", "editing", "audio", "opening_hook", "closing"):
            if k in a:
                out.append(f"* **{k.replace('_', ' ')}**: {bullet(a[k])}")
        if a.get("structure"):
            out += ["", "| When | Beat |", "|---|---|"]
            out += [f"| {s.get('start')}–{s.get('end')} | {s.get('beat')} |" for s in a["structure"]]
        if a.get("what_makes_it_work"):
            out += ["", "What makes it work:", ""] + [f"* {x}" for x in a["what_makes_it_work"]]
        out.append("")
    if wpms:
        out += ["## Averages", "",
                f"* words per minute: {sum(wpms) / len(wpms):.0f}",
                f"* image hold: {sum(holds) / len(holds):.1f} s" if holds else "", ""]
    path = video.dir / "reference.md"
    path.write_text("\n".join(out))
    return path
