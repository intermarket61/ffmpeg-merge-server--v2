"""Generate each shot's stills with Gemini and cache them in build/<id>/images.

video.json:
    "images": {
      "model": "gemini-3.1-flash-image",
      "aspect": "16:9",
      "style": "Hand-painted gouache illustration, ...:",   prepended to every prompt
      "suffix": "No text, letters, logos ...",             appended to every prompt
      "usd_per_image": 0.07,                               for the estimate only
      "refs": {"ruth": "character sheet prompt"}           recurring characters/places
    }

shots.json, per shot:
    "images": [
      "a plain prompt",
      {"prompt": "...", "refs": ["ruth"], "at": [line, "word"], "move": "in", "v": 2}
    ]

A still is named after a hash of everything that shapes it (model, aspect,
style, suffix, prompt, the reference images it was given, and `v`), so it is
generated once and reused while none of that changes. Bump `v` to ask for a
new take of one still. A ref is generated first and then passed to Gemini as
an input image with every prompt that names it, which keeps a character the
same from shot to shot. Nothing is generated without yes=True.
"""
import base64
import json

from . import gemini
from .util import sha256_text

DEFAULTS = {
    "model": "gemini-3.1-flash-image",
    "aspect": "16:9",
    "style": "",
    "suffix": "No text, letters, numbers, labels, logos, brand names or watermarks anywhere in the image.",
    "usd_per_image": 0.07,
}
EXT = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}


def cfg(video):
    return {**DEFAULTS, **video.meta.get("images", {})}


def entries(shot):
    """A shot's stills as dicts, whatever form they were written in."""
    return [{"prompt": e} if isinstance(e, str) else dict(e) for e in shot.images]


class Still:
    def __init__(self, video, prompt, refs=(), v=0, ref_name=None):
        c = cfg(video)
        self.video, self.prompt, self.ref_name = video, prompt, ref_name
        self.refs = [ref(video, r) for r in refs]
        missing = [r for r, s in zip(refs, self.refs) if s is None]
        if missing:
            raise SystemExit(f'images: unknown ref {", ".join(missing)} (add it to video.json "images.refs")')
        self.full = " ".join(x for x in (c["style"], prompt.strip(), c["suffix"]) if x)
        self.hash = sha256_text(c["model"], c["aspect"], self.full, str(v),
                                *[r.hash for r in self.refs])[:16]
        self.stem = (f"ref-{ref_name}-" if ref_name else "") + self.hash

    @property
    def path(self):
        hits = [p for p in sorted((self.video.build / "images").glob(self.stem + ".*"))
                if p.suffix != ".json" and not p.stem.endswith(".trim")]
        return hits[0] if hits else None

    @property
    def done(self):
        return self.path is not None

    def generate(self):
        c = cfg(self.video)
        parts = []
        for r in self.refs:
            if not r.done:
                r.generate()
            parts.append({"inline_data": {"mime_type": mime(r.path), "data": base64.b64encode(r.path.read_bytes()).decode()}})
        lead = ("Keep the character(s) and setting from the reference image(s) consistent "
                "(same face, hair, build, clothes and palette), in a new scene: ") if self.refs else ""
        parts.append({"text": lead + self.full})
        body = {"contents": [{"parts": parts}],
                "generationConfig": {"responseModalities": ["IMAGE"],
                                     "imageConfig": {"aspectRatio": c["aspect"]}}}
        resp = gemini.call(c["model"], "generateContent", body)
        cands = resp.get("candidates") or []
        img = next((p["inlineData"] for cand in cands for p in cand.get("content", {}).get("parts", [])
                    if "inlineData" in p), None)
        if not img:
            reason = cands[0].get("finishReason") if cands else resp.get("promptFeedback")
            raise RuntimeError(f"no image returned ({reason})")
        out = self.video.build / "images" / (self.stem + EXT.get(img.get("mimeType"), ".png"))
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(base64.b64decode(img["data"]))
        (out.parent / (self.stem + ".json")).write_text(json.dumps(
            {"prompt": self.full, "refs": [r.stem for r in self.refs], "model": c["model"]}, indent=1))
        return out


def mime(path):
    return {".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}[path.suffix]


_refs = {}


def ref(video, name):
    key = (id(video), name)
    if key not in _refs:
        prompt = cfg(video).get("refs", {}).get(name)
        _refs[key] = Still(video, prompt, ref_name=name) if prompt else None
    return _refs[key]


def stills(video, only=None):
    """[(shot, Still)] in shot order."""
    out = []
    for shot in video.shots:
        if only and shot.key not in only:
            continue
        for e in entries(shot):
            out.append((shot, Still(video, e["prompt"], e.get("refs", ()), e.get("v", 0))))
    return out


def needed(video, only=None):
    """Stills (refs included) not yet generated, deduplicated."""
    seen, todo = set(), []
    for _, s in stills(video, only):
        for x in s.refs + [s]:
            if not x.done and x.stem not in seen:
                seen.add(x.stem)
                todo.append(x)
    return todo


def estimate(video, todo):
    return len(todo) * cfg(video)["usd_per_image"]


def run(video, only=None, yes=False):
    todo = needed(video, only)
    if not todo:
        return []
    usd = estimate(video, todo)
    if not yes:
        raise SystemExit(f"images: {len(todo)} stills to generate, about ${usd:.2f}. "
                         "Re-run with --yes to spend it.")
    print(f"  generating {len(todo)} stills (~${usd:.2f})", flush=True)
    made, failed = [], []
    for s in todo:
        if s.done:                       # a ref made earlier in this loop
            continue
        try:
            p = s.generate()
            made.append(p)
            print(f"  {video.rel(p)}", flush=True)
        except (RuntimeError, OSError) as e:
            failed.append(s.stem)
            print(f"  FAILED {s.stem}: {e}", flush=True)
    if failed:
        print(f"images: {len(failed)} failed; re-run to retry them")
    return made


def trimmed(path):
    """The still with any painted paper margin cut off, cropped back to 16:9.
    Gemini often paints a cream deckle border round a gouache image, which
    would show as pale edges on screen. Made once, next to the original."""
    out = path.with_name(path.stem + ".trim.jpg")
    if out.exists():
        return out
    from PIL import Image

    im = Image.open(path).convert("RGB")
    w, h = im.size
    px = im.load()

    def paper(x, y):
        r, g, b = px[x, y]
        return min(r, g, b) > 185 and max(r, g, b) - min(r, g, b) < 45

    def margin(n, line):                 # how many edge lines are mostly paper
        for i in range(int(n * 0.09)):
            pts = line(i)
            if sum(paper(x, y) for x, y in pts) < 0.55 * len(pts):
                return i
        return int(n * 0.09)
    step = 4
    top = margin(h, lambda i: [(x, i) for x in range(0, w, step)])
    bot = margin(h, lambda i: [(x, h - 1 - i) for x in range(0, w, step)])
    left = margin(w, lambda i: [(i, y) for y in range(0, h, step)])
    right = margin(w, lambda i: [(w - 1 - i, y) for y in range(0, h, step)])
    pad = 0.012                          # brushy edges run a little past the margin
    box = [left + w * pad, top + h * pad, w - right - w * pad, h - bot - h * pad]
    if box == [w * pad, h * pad, w - w * pad, h - h * pad]:
        box = [0, 0, w, h]               # no margin: leave it whole
    cw, ch = box[2] - box[0], box[3] - box[1]
    if cw / ch > 16 / 9:                 # back to 16:9, centred
        d = (cw - ch * 16 / 9) / 2
        box[0] += d; box[2] -= d
    else:
        d = (ch - cw * 9 / 16) / 2
        box[1] += d; box[3] -= d
    im.crop(tuple(round(v) for v in box)).save(out, quality=94)
    return out


def resolved(shot):
    """The shot's stills for the scene page: file URI (or None) plus timing."""
    out = []
    for e, (_, s) in zip(entries(shot), stills(shot.video, [shot.key])):
        out.append({"src": trimmed(s.path).as_uri() if s.done else None, "prompt": e["prompt"],
                    "at": e.get("at"), "move": e.get("move")})
    return out
