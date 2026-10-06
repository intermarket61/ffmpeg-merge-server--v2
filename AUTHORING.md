# Authoring a video

This is the creative half of the pipeline: turning a script into
`shots.json` and, where needed, new scenes. Everything after that is
mechanical (`python -m engine make`). Read this before writing a video.
`videos/video-a` is the reference: 45 shots and 22 scenes, published at
10:42.

## 1. From script to shots

A **shot** is a run of voiceover sentences over one scene. Cut a new shot
when the picture should change: a new idea, a new graphic, or a return to
the presenter. Aim for 4–20 seconds; longer is fine when a scene builds
over several sentences (a diagram that gains a node per sentence).

```json
{
  "key": "d2",
  "part": "p2",
  "scene": "runChain",
  "lines": ["The research agent ran, the judgment agent ran, ...", "Which is the correct setting."],
  "hold": 0,
  "trim": 0,
  "params": { "tally": 1 }
}
```

| Field | Meaning |
|---|---|
| `key` | unique, short, stable. Build files are named after it. Prefix by beat (a1, a2, b1...) |
| `part` | which Hedra take supplies the face (see below) |
| `scene` | a `SCENES.<name>` from `scenes/library/` or `videos/<id>/scenes/` |
| `lines` | the exact words spoken, one sentence per entry. Scenes time animations to these |
| `hold` | seconds of silence after the last word, before the next shot (voiced into the take) |
| `trim` | seconds cut from the shot's tail **in the edit only** (see pauses below) |
| `params` | anything the scene reads through `P()`: pills, blocks, tally count... |

Write `lines` for the ear: spell out what should be heard ("be selective"
without quote marks, numbers as words when they're spoken as words).
ElevenLabs reads exactly this text.

A shot with `"lines": []` and a `hold` is a silent shot (an end card).

### Parts

Each part is one Hedra generation, so the face is lip-synced to that part's
continuous voice track. Keep parts at **8 minutes or under** (Hedra's cap is
10) and split at beat boundaries. Parts generate in parallel, so three
~4-minute parts finish faster than one long one.

**Once a part has a take, don't change the lines, holds or order of its
shots.** That changes the part's voice track, `status` will show the part
as `stale`, and fixing it means paying for a new take. To tighten a pause,
use `trim` (it cuts the edit only, so lip-sync is untouched). Changes to
visuals, params, scenes and `trim` are always free.

## 2. Scenes

A scene is a function that builds its DOM once and returns a tick function
that sets every style for a time `t`. It must be a **pure function of
time**: no timers, no requestAnimationFrame, no state carried between ticks
that depends on tick order. The engine renders frames in any order and in
parallel.

```js
// videos/<id>/scenes/myScene.js
SCENES.myScene=()=>{
  theme('dark');                                   // 'dark' | 'paper' | 'orange'
  const head=el('div','abs mega',null,'Headline'); // el(tag, class, parent, html)
  Object.assign(head.style,{left:'120px',top:'96px',fontSize:'96px'});
  const at=wordAt(0,'headline');                   // time the word is spoken (line 0)
  const camIn=cam(.2,270);                         // presenter in the corner
  const tl=tally();                                // failure counter, from params.tally
  return t=>{
    const k=spring((t-at)/.7);                     // 0 -> 1 with overshoot
    head.style.opacity=clamp((t-at)*5);
    head.style.transform=`translateY(${(1-k)*60}px)`;
    camIn(t); tl(t);
  };
};
```

What the runtime gives you (`scenes/runtime.js`):

| Timing | `S.duration`, `S.lines[i].t0/.t1`, `S.words[]`, `wordAt(line, word, nth)`, `wAt([line, word, nth])` |
|---|---|
| Easing | `clamp`, `lerp`, `ramp(t, start, dur, ease)`, `outCubic`, `outExpo`, `inOut`, `spring` |
| Building | `el`, `panel(parent, style)`, `theme(name)`, `P()` (the shot's params) |
| Presenter | `faceFull(z0, z1)` full frame with slow push-in; `cam(enterAt, size)` rounded-square frame bottom-left |
| Overlays | `tally(struck)`, `tallyStrike(n, at)`, `makePills(list)` + `runPills(pills, t)`, `pop(el, at)` |

`wordAt` matches a word case-insensitively with punctuation stripped. When
a word appears twice in a line, pass `nth`. If it isn't found it falls back
to the line's start, so a typo fails soft; check with stills.

**Library scenes** (`scenes/library/`, usable by any video, driven by
params):

| Scene | Params |
|---|---|
| `presenter` | `pills: [[line, word, html, nth?]]` (caption pills that pop on a word), `zoom: [z0, z1]`, `tally` |
| `textCard` | `theme`, `blocks: [{html, at: [line, word, nth?], size, serif?, italic?, color?}]`, `tally` |
| `failureTitle` | `n`, `title` (numbered section slam on orange; strikes tally bar n) |

Put a scene in the library when it takes all its content from params. Keep
scenes with baked-in content in the video's own `scenes/` folder. If
another video wants one, lift the content into params and move it to the
library.

## 3. Visual language

There are two looks. **Presenter videos** (video-a) use the kinetic look
below. **Presenter-free videos** (`"hedra": false`) are narrated over
painted stills; see section 7.

The presenter look matches two reference channels (RoboNuggets, Parker Prompts):
kinetic type, orange slams, cream paper cards, glowing node diagrams, a
presenter in a rounded-square frame.

| | |
|---|---|
| Palette | night `#0c0b0a`, coal `#171513`, cream `#f1eadf`, paper `#e9e1d3`, ink `#15120f`, orange `#ff5a1f`, green `#8fd694`, amber `#ffb13d`, blue `#7fc4d6` (CSS vars in `scenes/index.html`) |
| Type | Archivo 900 for headlines (`.mega`, tight tracking), Archivo 700 kickers in caps with wide tracking (`.kicker`), Newsreader serif/italic for asides and quotes |
| Rhythm | alternate presenter shots and graphics, and never show two static text cards in a row. Slam an orange full frame for big statements (sparingly: once or twice per section) |
| Motion | things spring in on the word that names them. Nothing moves without a reason. Slow camera drift (≤5% scale) on diagrams |
| Presenter | full frame for opinion and story. `cam()` bottom-left while a graphic holds the frame. The persistent `tally` sits top-right |
| Texture | film grain overlay at 0.13 and a soft vignette are always on (runtime) |

## 4. Pacing

* Pauses between sentences come from ElevenLabs and sound natural. Don't
  add more.
* `hold` after a shot: 0 by default. **Keep total silence at 1.3 s or
  under.** Longer pauses read as uncomfortable (reviewer feedback on
  video-a: 2–3 s holds after the scorecard, "it's a mood" and the four
  fixes all had to be trimmed). Up to ~2 s is right only for a deliberate,
  scripted beat of silence.
* Give text a beat to be read: a line of on-screen text needs about 0.3 s
  per word visible before it changes.

## 5. Layout rules and known pitfalls

* The `cam()` frame covers the bottom-left (about x < 400, y > 690 at the
  default 330 px). Keep content out of that corner, or pass a smaller
  size (240–280).
* The tally covers the top-right (x > 1500, y < 150).
* **SVG glow on straight lines**: a `<filter>` on a horizontal or vertical
  line has a zero-height bounding box and renders nothing. Use
  `filterUnits="userSpaceOnUse"` with explicit x, y, width and height.
* Text over the presenter: shade that side with a gradient, and keep the
  text clear of the face (roughly x 820–1180 at full frame).
* Cream `.sheet` cards need `theme('paper')`. On dark they look pasted on.
* The grain canvas is regenerated per frame from the frame number (it's
  deterministic). Don't use `Math.random()` in scenes; use `rng(seed)`.

## 6. The review loop

```bash
python -m engine voice videos/<id>                 # cheap; gives real timings
python -m engine stills videos/<id> --at 0.8       # one frame per shot -> build/<id>/stills
#   look at every still: overlaps, legibility, timing of reveals; fix; repeat
python -m engine status videos/<id>                # Hedra credit estimate
python -m engine hedra videos/<id> --yes           # the one costly step
python -m engine render videos/<id>                # only stale shots re-render
python -m engine merge videos/<id> && python -m engine previews videos/<id>
```

Stills work before Hedra: without a take, the presenter frame is empty,
which is enough to judge layout. Check stills at more than one point
(`--at 0.3`, `--at 0.9`) for scenes that build over time.

## 7. Presenter-free videos (painted stills)

Set `"hedra": false` in video.json. There is no face, so `part` can be left
out of shots and the Hedra step is skipped. `videos/richest-room` is the
worked example.

**Study the reference first.** List the channel and 1–3 example videos
under `"reference"` in video.json and run `python -m engine analyze
videos/<id>`. The free pass gets titles and thumbnails. `--yes` has
Gemini watch each video and fills `videos/<id>/reference.md` with its
structure, pacing and look (a few cents per video, printed first). Learn
the *format* from it. Never reuse its words, characters, examples or look:
the script is original, and the visuals must be clearly different.

**Stills.** Each shot lists its `images` (see `engine/images.py`).
`"images"` in video.json holds the model, the style prefix that goes in
front of every prompt, and the suffix that bans text. `refs` holds the
recurring characters and places: name one in a still's `refs` and its
reference image is sent along with the prompt, which keeps a face the
same from shot to shot. `python -m engine images videos/<id>` prints the
count and cost. `--yes` generates them into `build/<id>/images`, named by
a hash of everything that shaped them, so a still is paid for once. To
reroll one bad still, bump its `"v"`.

| Scene | Use |
|---|---|
| `still` | the shot's images full frame, a slow 100→106% push or drift on each, a 1 s dissolve between. Each image starts at its `at` word, or the sentences are shared out evenly. `params.notes: [[line, word, html]]` shows a small paper label lower left |
| `chapter` | numbered section card: `params: {n, title}` on warm paper (or over the shot's first image) |

**The gouache look** (`style-tests/CHOSEN.md`):

| | |
|---|---|
| Palette | ochre, sage, dusty blue in the art; paper `#efe5d2`, ink `#3b2f24`, accent `#b9772f`/`#a5552a` in the type |
| Type | Newsreader only: italic numerals on chapter cards, roman for notes. No burned-in word-by-word captions (YouTube gets the .srt) |
| Rhythm | one still per sentence or so (6–9 s); a note label at most once per shot, for the line worth remembering |
| Texture | `"look": {"grain": 0.05, "vignette": 0.55}`: the paint is the texture |

**Prompts.** These rules come from the style test:

* Name no brands. Describe props as plain or unlabelled, and keep paper,
  signs and screens blank or turned away. The model still adds lettering
  sometimes, so check every still.
* Put a character's ref on every still they appear in, and describe the
  action, not their look (the ref carries that).
* Review all the stills before rendering: `stills` shows each one in place,
  with a placeholder card for any not generated yet.

