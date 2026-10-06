"""Video pipeline CLI.

    python -m engine make videos/<id> [--yes]     voice, images, Hedra, render, merge, previews
    python -m engine status videos/<id> [--json]  what is done, what is next, what it costs
    python -m engine approve videos/<id> script --budget 8    gate 1 (human only)
    python -m engine approve videos/<id> cut                  gate 2 (human only)

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
import json
import sys

from . import analyze, gates, hedra, images, mix, render, voice
from .video import Video


def keys(arg):
    return [k.strip() for k in arg.split(",")] if arg else None


def report(video):
    """Everything status knows, as data. `next` is the one thing to do now."""
    unvoiced = [s for s in video.shots if not s.voiced]
    chars = sum(len(s.text) for s in unvoiced)
    r = {"id": video.id, "title": video.meta.get("title"), "shots": len(video.shots),
         "minutes": round(video.total / 60, 2), "presenter": video.uses_hedra,
         "voice": {"unvoiced": [s.key for s in unvoiced], "chars": chars,
                   "usd": round(gates.voice_usd(video, chars), 2)}}
    if any(s.images for s in video.shots):
        todo = images.needed(video)
        r["images"] = {"total": len(images.stills(video)), "todo": len(todo),
                       "usd": round(images.estimate(video, todo), 2)}
    if video.uses_hedra and not unvoiced:
        st = hedra.status(video)
        need = [p for p, s in st.items() if s in ("missing", "stale")]
        r["hedra"] = {"parts": st, "credits": hedra.estimate(video, need) if need else 0}
    r["render"] = {"stale": render.stale(video)}
    clips = [video.build / "shots" / f"{s.key}.mp4" for s in video.shots]
    merged = video.final.exists() and all(c.exists() and c.stat().st_mtime <= video.final.stat().st_mtime
                                          for c in clips)
    r["final"] = {"path": video.rel(video.final) if video.final.exists() else None, "current": merged,
                  "previews": sorted(video.rel(p) for p in (video.build / "previews").glob("*.mp4"))}
    pub = video.build / "publish.json"
    yt = json.loads(pub.read_text()).get("youtube", {}) if pub.exists() else {}
    from .util import sha256_file
    r["published"] = {"youtube": yt.get("video_id"),
                      "current": bool(yt) and merged and yt.get("video_sha") == sha256_file(video.final)}
    if gates.enabled(video):
        r["gates"] = gates.state(video)
    g = r.get("gates", {})
    if g and g["script"] != "approved":
        r["next"] = "gate:script"
    elif unvoiced:
        r["next"] = "voice"
    elif r.get("images", {}).get("todo"):
        r["next"] = "images"
    elif r.get("hedra", {}).get("credits"):
        r["next"] = "hedra"
    elif r["render"]["stale"]:
        r["next"] = "render"
    elif not merged:
        r["next"] = "merge"
    elif g and g["cut"] != "approved":
        r["next"] = "gate:cut"
    elif not r["published"]["current"]:
        r["next"] = "publish"
    else:
        r["next"] = "done"
    return r


def cmd_status(video, args):
    r = report(video)
    if args.json:
        print(json.dumps(r, indent=2))
        return
    print(f"{video.id}: {r['shots']} shots, {r['minutes']:.1f} min cut, parts {', '.join(video.parts)}")
    v = r["voice"]
    todo_v = f"{len(v['unvoiced'])} shots unvoiced, {v['chars']:,} characters to read (~${v['usd']:.2f})"
    print(f"  voice:  {'all voiced' if not v['unvoiced'] else todo_v}")
    if "images" in r:
        i = r["images"]
        extra = f", {i['todo']} to generate (~${i['usd']:.2f})" if i["todo"] else ""
        print(f"  images: {i['total']} stills{extra}")
    if not video.uses_hedra:
        print("  hedra:  off (presenter-free)")
    elif "hedra" in r:
        h = r["hedra"]
        need = [p for p, s in h["parts"].items() if s in ("missing", "stale")]
        extra = f" (~{h['credits']} credits to make {', '.join(need)})" if need else ""
        print(f"  hedra:  {', '.join(f'{p} {s}' for p, s in h['parts'].items())}{extra}")
    todo = r["render"]["stale"]
    print(f"  render: {'all current' if not todo else f'{len(todo)} to render: ' + ', '.join(todo)}")
    print(f"  final:  {r['final']['path'] or 'not merged'}{'' if r['final']['current'] or not r['final']['path'] else ' (out of date)'}")
    if "gates" in r:
        g = r["gates"]
        print(f"  gates:  script {g['script']}, cut {g['cut']}; spent ${g['spent_usd']:.2f} of ${g['budget_usd']:.2f}")
    if r["published"]["youtube"]:
        print(f"  youtube: {r['published']['youtube']}{'' if r['published']['current'] else ' (an older cut)'}")
    print(f"  next:   {r['next']}")


def cmd_approve(video, args):
    if not args.gate:
        raise SystemExit("approve what? script or cut")
    a = gates.approve(video, args.gate, budget=args.budget, by=args.by)
    extra = f", budget ${a['budget_usd']:.2f}" if args.gate == "script" else ""
    print(f"{args.gate} approved by {a['by']}{extra} -> {video.rel(gates.path(video))}")


def cmd_voice(video, args):
    done = voice.run(video, keys(args.only), args.force, yes=args.yes)
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


COMMANDS = {"status": cmd_status, "approve": cmd_approve, "analyze": cmd_analyze, "voice": cmd_voice, "images": cmd_images, "hedra": cmd_hedra, "render": cmd_render,
            "merge": cmd_merge, "previews": cmd_previews, "stills": cmd_stills, "make": cmd_make,
            "publish": cmd_publish}


def main(argv=None):
    ap = argparse.ArgumentParser(prog="python -m engine", description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("command", choices=COMMANDS)
    ap.add_argument("video", help="path to a video folder, e.g. videos/video-a")
    ap.add_argument("gate", nargs="?", choices=["script", "cut"], help="approve: which gate")
    ap.add_argument("--budget", type=float, help="approve script: US dollars this video may spend")
    ap.add_argument("--by", default="human", help="approve: who approved (recorded)")
    ap.add_argument("--json", action="store_true", help="status: machine-readable")
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
