"""A video: its settings (video.json), its shot list (shots.json), and where
everything it builds lives (build/<id>/).

Two timelines matter:
  * the cut: shots back to back at their trimmed length (shot.offset)
  * a Hedra take: one per part, shots back to back at their full voiced
    duration (shot.part_offset). A take is lip-synced to that part's voice
    track, so this timeline must never change once a take exists.
Trimming a shot shortens the cut without touching any take.
"""
import json
from pathlib import Path

from .util import BUILD_ROOT, ROOT

READ_WPM = 190          # estimate used only before a shot has been voiced
SENTENCE_GAP = 0.35     # breath between sentences in that estimate
VO_TAIL = 0.45          # air after the last word of a shot


def sentence_dur(text):
    return len(text.split()) / READ_WPM * 60 + SENTENCE_GAP


class Shot:
    def __init__(self, video, data):
        self.video = video
        self.key = data["key"]
        self.part = data.get("part", "p1")  # which Hedra take the face comes from
        self.scene = data["scene"]          # SCENES.<name> in a scene file
        self.lines = data["lines"]          # voiceover sentences, spoken in order
        self.hold = data.get("hold", 0.0)   # silence after the last word
        self.trim = data.get("trim", 0.0)   # seconds cut from the tail in the edit only
        self.params = data.get("params", {})
        self.images = data.get("images", [])  # stills for the scene (engine/images.py)
        self.offset = 0.0
        self.part_offset = 0.0
        self.starts, self.ends, self.words = [], [], []
        self._time()

    @property
    def text(self):
        return " ".join(self.lines)

    @property
    def vo_json(self):
        return self.video.build / "vo" / f"{self.key}.json"

    @property
    def vo_mp3(self):
        return self.video.build / "vo" / f"{self.key}.mp3"

    @property
    def voiced(self):
        """Voiced, and voiced from the current text."""
        if not self.lines:
            return True
        if not (self.vo_json.exists() and self.vo_mp3.exists()):
            return False
        return json.loads(self.vo_json.read_text())["text"] == self.text

    def _time(self):
        if not self.lines:
            self.duration = self.hold
        elif self.voiced:
            self._from_alignment(json.loads(self.vo_json.read_text()))
            self.duration = self.ends[-1] + VO_TAIL + self.hold
        else:
            acc = 0.0
            for line in self.lines:
                self.starts.append(acc)
                self.ends.append(acc + sentence_dur(line) - SENTENCE_GAP)
                acc += sentence_dur(line)
            self.duration = acc + self.hold

    def _from_alignment(self, al):
        """Sentence and word times from ElevenLabs character timestamps."""
        text = al["text"]
        begin, stop = al["character_start_times_seconds"], al["character_end_times_seconds"]
        spans, pos = [], 0
        for line in self.lines:
            i = text.index(line, pos)
            spans.append((i, i + len(line)))
            self.starts.append(begin[i])
            self.ends.append(stop[i + len(line) - 1])
            pos = i + len(line)
        i = 0
        while i < len(text):
            if text[i].isspace():
                i += 1
                continue
            j = i
            while j < len(text) and not text[j].isspace():
                j += 1
            line = next(n for n, (a, b) in enumerate(spans) if a <= i < b)
            self.words.append({"w": text[i:j], "t0": begin[i], "t1": stop[j - 1], "line": line})
            i = j

    @property
    def length(self):
        """Seconds this shot occupies in the finished cut."""
        return self.duration - self.trim

    def spec(self, first, last):
        """What the scene page receives in setup()."""
        from . import images
        return {"key": self.key, "scene": self.scene, "duration": self.duration,
                "lines": [{"t0": a, "t1": b} for a, b in zip(self.starts, self.ends)],
                "words": self.words, "fadeIn": first, "fadeOut": last,
                "params": self.params, "images": images.resolved(self) if self.images else [],
                "look": self.video.meta.get("look", {})}


class Video:
    def __init__(self, path):
        self.dir = Path(path).resolve()
        if not (self.dir / "video.json").exists():
            raise SystemExit(f"{self.dir} has no video.json")
        self.meta = json.loads((self.dir / "video.json").read_text())
        self.id = self.meta.get("id", self.dir.name)
        self.build = BUILD_ROOT / self.id
        self.reload()

    def reload(self):
        """Re-read shots (after voicing, timings change)."""
        data = json.loads((self.dir / "shots.json").read_text())
        keys = [d["key"] for d in data]
        if len(keys) != len(set(keys)):
            raise SystemExit("shots.json has duplicate keys")
        self.shots = [Shot(self, d) for d in data]
        self.total = self._layout()

    def _layout(self):
        clock, part_clock = 0.0, {}
        for shot in self.shots:
            shot.offset = clock
            shot.part_offset = part_clock.get(shot.part, 0.0)
            part_clock[shot.part] = shot.part_offset + shot.duration
            clock += shot.length
        self.part_lengths = part_clock
        return clock

    @property
    def parts(self):
        return list(dict.fromkeys(s.part for s in self.shots))

    def part_shots(self, part=None):
        return [s for s in self.shots if part is None or s.part == part]

    def shot(self, key):
        return next(s for s in self.shots if s.key == key)

    @property
    def uses_hedra(self):
        """False for presenter-free videos ("hedra": false in video.json)."""
        return self.meta.get("hedra", {}) is not False

    @property
    def presenter(self):
        return self.dir / self.meta.get("presenter", "presenter.webp")

    def scene_files(self):
        """Scene scripts in load order: shared library, then this video's own."""
        lib = sorted((ROOT / "scenes" / "library").glob("*.js"))
        own = sorted((self.dir / "scenes").glob("*.js")) if (self.dir / "scenes").exists() else []
        return lib + own

    @property
    def final(self):
        return self.build / f"{self.id}.mp4"

    @property
    def captions(self):
        return self.build / f"{self.id}.srt"

    def rel(self, path):
        try:
            return str(Path(path).relative_to(ROOT))
        except ValueError:
            return str(path)
