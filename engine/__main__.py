"""Video pipeline CLI.

    python -m engine make videos/<id> [--yes]     voice, images, Hedra, render, merge, previews
    python -m engine status videos/<id>           what is done, what is next, what it costs

Single steps, each safe to re-run (finished work is skipped):
    analyze  [--yes]                     study the reference videos -> videos/<id>/reference.md
    voice    [--only k1,k2] [--force]    ElevenLabs read per shot
    images   [--only k1,k2] [--yes]      Gemini stills per shot (spends money)
    hedra    [--yes]                     lip-synced take per part (spends credits)
    render   [--only k1,k2] [--force]    motion graphics per shot
    merge                                cut + voice -> build/<id>/<id>.mp4 and .srt
    previews                             720p parts under ~20 MB for sharing
    stills   [--only k1,k2] [--at 0.6]   one review frame per shot
    publish  [--s3] [--youtube]          upload the finished cut (see engine/publish.py)
"""
import argparse
import sys

from . import analyze, hedra, images, mix, render, voice
from .video import Video


def keys(arg):
    return [k.strip() for k in arg.split(",")] if arg else None


def cmd_status(video, args):
    print(f"{video.id}: {len(video.shots)} shots, {video.total / 60:.1f} min cut, parts {', '.join(video.parts)}")
    unvoiced = [s for s in video.shots if not s.voiced]
    chars = sum(len(s.text) for s in unvoiced)
    print(f"  voice:  {'all voiced' if not unvoiced else f'{len(unvoiced)} shots unvoiced, {chars:,} characters to read'}")
    if any(s.images for s in video.shots):
        total = len(images.stills(video))
        todo = images.needed(video)
        extra = f", {len(todo)} to generate (~${images.estimate(video, todo):.2f})" if todo else ""
        print(f"  images: {total} stills{extra}")
    if not video.uses_hedra:
        print("  hedra:  off (presenter-free)")
    elif not unvoiced:
        st = hedra.status(video)
        need = [p for p, s in st.items() if s in ('missing', 'stale')]
        extra = f" (~{hedra.estimate(video, need)} credits to make {', '.join(need)})" if need else ""
        print(f"  hedra:  {', '.join(f'{p} {s}' for p, s in st.items())}{extra}")
    todo = render.stale(video)
    print(f"  render: {'all current' if not todo else f'{len(todo)} to render: ' + ', '.join(todo)}")
    print(f"  final:  {video.rel(video.final) if video.final.exists() else 'not merged'}")


def cmd_voice(video, args):
    done = voice.run(video, keys(args.only), args.force)
    print(f"voiced {len(done)} shots" if done else "voice: nothing to do")


def cmd_analyze(video, args):
    print(f"brief -> {video.rel(analyze.run(video, yes=args.yes))}")


def cmd_images(video, args):
    made = images.run(video, keys(args.only), yes=args.yes)
    print(f"images: {len(made)} generated" if made else "images: all stills current")


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


def cmd_stills(video, args):
    ks = keys(args.only) or [s.key for s in video.shots]
    for p in render.stills(video, ks, at=args.at):
        print(f"  {video.rel(p)}")


def cmd_make(video, args):
    cmd_voice(video, args)
    cmd_images(video, argparse.Namespace(only=None, yes=args.yes))
    cmd_hedra(video, args)
    video.reload()
    cmd_render(video, argparse.Namespace(only=None, force=False))
    cmd_merge(video, args)
    cmd_previews(video, args)


def cmd_publish(video, args):
    from . import publish
    publish.run(video, s3=args.s3 or not args.youtube, youtube=args.youtube or not args.s3)


COMMANDS = {"status": cmd_status, "analyze": cmd_analyze, "voice": cmd_voice, "images": cmd_images, "hedra": cmd_hedra, "render": cmd_render,
            "merge": cmd_merge, "previews": cmd_previews, "stills": cmd_stills, "make": cmd_make,
            "publish": cmd_publish}


def main(argv=None):
    ap = argparse.ArgumentParser(prog="python -m engine", description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", choices=COMMANDS)
    ap.add_argument("video", help="path to a video folder, e.g. videos/video-a")
    ap.add_argument("--only", help="comma-separated shot keys")
    ap.add_argument("--force", action="store_true", help="redo even if current")
    ap.add_argument("--yes", action="store_true", help="allow spending (Hedra credits, Gemini images and analysis)")
    ap.add_argument("--at", type=float, default=0.6, help="stills: fraction into each shot")
    ap.add_argument("--s3", action="store_true", help="publish: S3 only")
    ap.add_argument("--youtube", action="store_true", help="publish: YouTube only")
    args = ap.parse_args(argv)
    COMMANDS[args.command](Video(args.video), args)


if __name__ == "__main__":
    sys.exit(main())
