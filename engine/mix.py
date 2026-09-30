"""Audio tracks, the final merge, captions and shareable previews."""
import subprocess

from .util import ffmpeg_exe, sha256_file


def voice_track(video, part=None):
    """One continuous voice track. Per part it is exactly what Hedra lip-syncs
    to, so it keeps full voiced durations; for the film it follows the cut
    (trimmed lengths). Returns None while any shot is unvoiced."""
    ff = ffmpeg_exe()
    shots = video.part_shots(part)
    if any(not s.voiced for s in shots):
        return None
    out = video.build / "vo" / (f"part-{part}.wav" if part else "film.wav")
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = [ff, "-y", "-loglevel", "error"]
    for s in shots:
        cmd += (["-i", str(s.vo_mp3)] if s.lines else
                ["-f", "lavfi", "-t", f"{s.duration:.3f}", "-i", "anullsrc=r=48000:cl=mono"])
    dur = (lambda s: s.duration) if part else (lambda s: s.length)
    chains = "".join(f"[{i}:a]aresample=48000,aformat=channel_layouts=mono,apad,"
                     f"atrim=0:{dur(s):.3f}[a{i}];" for i, s in enumerate(shots))
    chains += "".join(f"[a{i}]" for i in range(len(shots)))
    chains += f"concat=n={len(shots)}:v=0:a=1[out]"
    subprocess.run(cmd + ["-filter_complex", chains, "-map", "[out]", "-ac", "1", str(out)],
                   check=True)
    return out


def part_track_sha(video, part):
    track = voice_track(video, part)
    return (track, sha256_file(track)) if track else (None, None)


def merge(video):
    ff = ffmpeg_exe()
    missing = [s.key for s in video.shots if not (video.build / "shots" / f"{s.key}.mp4").exists()]
    if missing:
        raise SystemExit(f"cannot merge, shots not rendered: {', '.join(missing)}")
    listing = video.build / "shots.txt"
    listing.write_text("".join(f"file 'shots/{s.key}.mp4'\n" for s in video.shots))
    vo = voice_track(video)
    audio = ["-i", str(vo)] if vo else ["-f", "lavfi", "-t", f"{video.total:.3f}",
                                        "-i", "anullsrc=r=48000:cl=stereo"]
    subprocess.run([ff, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
                    "-i", str(listing), *audio, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-shortest", "-movflags", "+faststart", str(video.final)], check=True)
    write_srt(video)
    return video.final


def srt_time(s):
    ms = round(s * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def write_srt(video):
    cues = [(s.offset + a, s.offset + b, line)
            for s in video.shots for a, b, line in zip(s.starts, s.ends, s.lines)]
    video.captions.write_text("\n".join(f"{n}\n{srt_time(a)} --> {srt_time(b)}\n{txt}\n"
                                        for n, (a, b, txt) in enumerate(cues, 1)))
    return video.captions


def previews(video, max_part=150.0):
    """720p parts of at most max_part seconds, cut between shots, each small
    enough (~20 MB) to send through a chat."""
    ff = ffmpeg_exe()
    out_dir = video.build / "previews"
    out_dir.mkdir(parents=True, exist_ok=True)
    for old in out_dir.glob("*.mp4"):
        old.unlink()
    cuts = [0.0]
    for s in video.shots:
        if s.offset + s.length - cuts[-1] > max_part:
            cuts.append(s.offset)
    cuts.append(video.total)
    n, outs = len(cuts) - 1, []
    for i in range(n):
        a, b = cuts[i], cuts[i + 1]
        out = out_dir / f"{video.id}-{i + 1}of{n}.mp4"
        subprocess.run([ff, "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-t", f"{b - a:.3f}",
                        "-i", str(video.final), "-vf", "scale=1280:720", "-c:v", "libx264",
                        "-preset", "slow", "-crf", "25", "-maxrate", "1450k", "-bufsize", "2900k",
                        "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", str(out)],
                       check=True)
        outs.append(out)
    return outs
