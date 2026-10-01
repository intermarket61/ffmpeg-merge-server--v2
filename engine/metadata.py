"""What goes to YouTube besides the video: title, description with chapters,
tags, category, language.

Chapters come from shots.json: a shot with a "chapter" title starts a
chapter, timed from where that shot lands in the cut. YouTube shows them
only when the first starts at 0:00, there are at least three, and each is
at least ten seconds long, so anything else is an error here rather than a
silently missing feature on the watch page.
"""


def stamp(seconds):
    s = int(seconds)
    return f"{s // 3600}:{s // 60 % 60:02d}:{s % 60:02d}" if s >= 3600 else f"{s // 60}:{s % 60:02d}"


def chapters(video):
    marks = [(shot.offset, shot.chapter) for shot in video.shots if shot.chapter]
    if not marks:
        return []
    if marks[0][0] > 0.5:
        raise SystemExit(f"first chapter must start the video (it starts at {stamp(marks[0][0])})")
    if len(marks) < 3:
        raise SystemExit("YouTube needs at least three chapters; add more or remove them")
    ends = [t for t, _ in marks[1:]] + [video.total]
    for (t, title), end in zip(marks, ends):
        if end - t < 10:
            raise SystemExit(f"chapter '{title}' is {end - t:.1f}s; YouTube needs at least 10s each")
    return [(0.0, marks[0][1])] + marks[1:]


def youtube(video):
    """The metadata publish sends, and records next to the video."""
    yt = video.meta.get("youtube", {})
    description = yt.get("description", "")
    ch = chapters(video)
    if ch:
        description += "\n\n" + "\n".join(f"{stamp(t)} {title}" for t, title in ch)
    return {"title": yt.get("title", video.meta.get("title", video.id))[:100],
            "description": description[:5000], "tags": yt.get("tags", []),
            "categoryId": yt.get("category_id", "28"),
            "defaultLanguage": yt.get("language", "en"),
            "defaultAudioLanguage": yt.get("language", "en")}


def short(video, short, long_id=None):
    """A Short's own metadata; it points to the full video once that is uploaded."""
    yt = video.meta.get("youtube", {})
    description = short.get("description", "")
    if long_id:
        description += f"\n\nFull video: https://youtu.be/{long_id}"
    description += "\n\n#Shorts"
    return {"title": short["title"][:100], "description": description[:5000],
            "tags": short.get("tags", yt.get("tags", [])), "categoryId": yt.get("category_id", "28"),
            "defaultLanguage": yt.get("language", "en"), "defaultAudioLanguage": yt.get("language", "en")}
