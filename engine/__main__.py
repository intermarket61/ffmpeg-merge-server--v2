"""Video pipeline CLI.

    python -m engine make videos/<id> [--yes]     voice, Hedra, render, merge, previews
    python -m engine status videos/<id>           what is done and what is next

Single steps, each safe to re-run (finished work is skipped):
    voice    [--only k1,k2] [--force]    ElevenLabs read per shot
    hedra    [--yes]                     lip-synced take per part (spends credits)
    render   [--only k1,k2] [--force]    motion graphics per shot
    merge                                cut + voice -> build/<id>/<id>.mp4 and .srt
    previews                             720p parts under ~20 MB, and the vertical Shorts
    stills   [--only k1,k2] [--at 0.6]   one review frame per shot, plus the thumbnail
    publish  [--s3] [--youtube]          upload the finished cut (see engine/publish.py)
"""
import argparse
import sys

from . import hedra, metadata, mix, render, shorts, thumbnail, voice
from .video import Video


def keys(arg):
    return [k.strip() for k in arg.split(",")] if arg else None


def cmd_status(video, args):
    print(f"{video.id}: {len(video.shots)} shots, {video.total / 60:.1f} min cut, parts {', '.join(video.parts)}")
    if hedra.too_short(video):
        print(f"  length: {video.total / 60:.2f} min, under the {hedra.MIN_MINUTES} min floor; hedra will refuse")
    unvoiced = [s.key for s in video.shots if not s.voiced]
    print(f"  voice:  {'all voiced' if not unvoiced else 'unvoiced ' + ', '.join(unvoiced)}")
    if not unvoiced:
        st = hedra.status(video)
        need = [p for p, s in st.items() if s in ('missing', 'stale')]
        extra = f" (~{hedra.estimate(video, need)} credits to make {', '.join(need)})" if need else ""
        print(f"  hedra:  {', '.join(f'{p} {s}' for p, s in st.items())}{extra}")
    todo = render.stale(video)
    print(f"  render: {'all current' if not todo else f'{len(todo)} to render: ' + ', '.join(todo)}")
    print(f"  final:  {video.rel(video.final) if video.final.exists() else 'not merged'}")
    ch = metadata.chapters(video)
    print(f"  youtube: {len(ch)} chapters, thumbnail {'set up' if video.meta.get('thumbnail') else 'not set up'}")


def cmd_voice(video, args):
    done = voice.run(video, keys(args.only), args.force)
    print(f"voiced {len(done)} shots" if done else "voice: nothing to do")


def cmd_hedra(video, args):
    made = hedra.run(video, yes=args.yes)
    print(f"hedra: {', '.join(made)} ready" if made else "hedra: all takes current")


def cmd_render(video, args):
    done = render.run(video, keys(args.only), args.force)
    print(f"rendered {len(done)} shots" if done else "render: all shots current")


def cmd_merge(video, args):
    out = mix.merge(video)
    print(f"merged -> {video.rel(out)} ({video.total / 60:.2f} min), captions -> {video.rel(video.captions)}")


def cmd_previews(video, args):
    for p in mix.previews(video):
        print(f"  {video.rel(p)}  {p.stat().st_size / 2**20:.1f} MiB")
    for p in shorts.make(video):
        print(f"  {video.rel(p)}  {p.stat().st_size / 2**20:.1f} MiB (Short)")


def cmd_stills(video, args):
    ks = keys(args.only) or [s.key for s in video.shots]
    for p in render.stills(video, ks, at=args.at):
        print(f"  {video.rel(p)}")
    if not args.only or "thumbnail" in ks:
        th = thumbnail.make(video)
        if th:
            print(f"  {video.rel(th)}")


def cmd_make(video, args):
    cmd_voice(video, args)
    cmd_hedra(video, args)
    video.reload()
    cmd_render(video, argparse.Namespace(only=None, force=False))
    cmd_merge(video, args)
    cmd_previews(video, args)
    if thumbnail.make(video):
        print(f"thumbnail -> {video.rel(thumbnail.path(video))}")


def cmd_publish(video, args):
    from . import publish
    publish.run(video, s3=args.s3 or not args.youtube, youtube=args.youtube or not args.s3)


COMMANDS = {"status": cmd_status, "voice": cmd_voice, "hedra": cmd_hedra, "render": cmd_render,
            "merge": cmd_merge, "previews": cmd_previews, "stills": cmd_stills, "make": cmd_make,
            "publish": cmd_publish}


def main(argv=None):
    ap = argparse.ArgumentParser(prog="python -m engine", description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", choices=COMMANDS)
    ap.add_argument("video", help="path to a video folder, e.g. videos/video-a")
    ap.add_argument("--only", help="comma-separated shot keys")
    ap.add_argument("--force", action="store_true", help="redo even if current")
    ap.add_argument("--yes", action="store_true", help="allow spending Hedra credits")
    ap.add_argument("--at", type=float, default=0.6, help="stills: fraction into each shot")
    ap.add_argument("--s3", action="store_true", help="publish: S3 only")
    ap.add_argument("--youtube", action="store_true", help="publish: YouTube only")
    args = ap.parse_args(argv)
    COMMANDS[args.command](Video(args.video), args)


if __name__ == "__main__":
    sys.exit(main())
