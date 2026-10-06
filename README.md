# Video pipeline

Turns a written script into a finished talking-head video with motion
graphics:

1. **Voice**: ElevenLabs reads each shot in your cloned voice, with
   character timestamps.
2. **Presenter**: Hedra lip-syncs a single presenter photo to that voice.
3. **Motion graphics**: HTML/CSS scenes, synced to the spoken words, are
   rendered frame by frame in headless Chromium with the lip-synced
   presenter composited in.
4. **Cut**: ffmpeg joins the shots under the voice track, and writes
   captions and small preview files.
5. **Publish**: the finished cut goes to S3 and to YouTube as a private
   upload.

Every step is safe to re-run. Finished work is skipped, a restart resumes
where it stopped, and Hedra credits are only spent with `--yes`.

## Setup

```bash
./setup.sh                  # Python packages + Chromium for Playwright
cp .env.example .env        # then fill in your keys and export them
```

Requires Python 3.10+. ffmpeg comes from `imageio-ffmpeg` if none is
installed.

## Making a video

```bash
python -m engine status videos/video-a        # what is done, what is next, what it costs
python -m engine make videos/video-a --yes    # voice -> Hedra -> render -> merge -> previews
python -m engine publish videos/video-a       # S3 + YouTube (private)
```

Outputs land in `build/<id>/`:

| Path | What |
|---|---|
| `<id>.mp4`, `<id>.srt` | the finished 1080p cut and its captions |
| `previews/` | 720p parts under ~20 MB each, cut between shots |
| `shots/` | one clip per shot, each stamped with the hash of its inputs |
| `vo/`, `hedra/` | voice takes and lip-synced presenter takes (the costly parts) |
| `stills/` | review frames from `python -m engine stills` |

`build/` is never committed. Treat `vo/` and `hedra/` as paid-for assets
and keep a copy (`publish` uploads them to S3 alongside the cut).

Single steps: `analyze`, `voice`, `images`, `hedra`, `render`, `merge`,
`previews`, `stills`, `publish`. Run `python -m engine --help` for flags. `--only a1,b2` limits
a step to some shots, and `--force` redoes current work.

## A new video

Write `videos/<id>/video.json` and `videos/<id>/shots.json`, add a
presenter photo, and add any scenes the library doesn't have. See
**[AUTHORING.md](AUTHORING.md)**: it covers the shot format, the scene
contract, the visual language, and the review loop. `videos/video-a` is a
complete worked example.

## Layout

```
engine/            pipeline code (no video-specific logic)
scenes/            page shell, runtime and the shared scene library
videos/<id>/       one folder per video: settings, shots, presenter, own scenes
assets/fonts/      Archivo and Newsreader (SIL Open Font License)
```

## Costs, roughly

| Step | Cost |
|---|---|
| ElevenLabs | per character, about 10k characters for a 10-minute video |
| Gemini stills | about $0.07 each (estimate, set `usd_per_image`); `images --yes` |
| Gemini analysis | a few cents per reference video; `analyze --yes` |
| Hedra Character 3 at 1080p | about 8.75 credits per second of video (about 5,600 for 10 minutes) |
| Rendering | free, about 35 minutes for 10 minutes of video on 4 cores |

`status` prints the voice, image and Hedra estimates before anything is
spent. Presenter-free videos (`"hedra": false`) skip Hedra entirely; see
AUTHORING.md section 7.
