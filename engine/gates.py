"""Human gates and a spending budget, for running the pipeline unattended
(an orchestrator such as Hermes Agent).

A video opts in with "gates": true in video.json. Then:

  * Gate 1, the script. `approve videos/<id> script --budget 8` records the
    hash of shots.json and video.json plus a budget in US dollars. Paid steps
    (voice, images, analyze) run without --yes only while that approval matches
    the current files and the step's estimate fits in what is left of the
    budget. Editing the script after approval closes the gate again.
  * Gate 2, the cut. `approve videos/<id> cut` records the hash of the
    finished mp4. `publish` refuses until that matches the current file.

Approvals and the spend log live in videos/<id>/approvals.json, so they
survive a fresh machine and show up in git history. Hedra is never
budget-approved: presenter videos still need an explicit --yes.

The gates stop mistakes, not a determined agent: anything with a shell can
edit approvals.json. Hard limits belong at the providers (a Google Cloud
budget, the ElevenLabs plan) and YouTube uploads stay private.
"""
import json
import time

from .util import sha256_file, sha256_text

VOICE_USD_PER_1K_CHARS = 0.30   # estimate; set "voice": {"usd_per_1k_chars": ...}


def enabled(video):
    return bool(video.meta.get("gates"))


def path(video):
    return video.dir / "approvals.json"


def load(video):
    p = path(video)
    return json.loads(p.read_text()) if p.exists() else {"spent": []}


def save(video, rec):
    path(video).write_text(json.dumps(rec, indent=2) + "\n")


def script_sha(video):
    return sha256_text((video.dir / "shots.json").read_text(), (video.dir / "video.json").read_text())


def approve(video, gate, budget=None, by="human"):
    rec = load(video)
    now = time.strftime("%Y-%m-%dT%H:%M:%S%z")
    if gate == "script":
        if budget is None:
            raise SystemExit("approve script needs --budget (US dollars this video may spend)")
        rec["script"] = {"sha": script_sha(video), "budget_usd": budget, "at": now, "by": by}
    elif gate == "cut":
        if not video.final.exists():
            raise SystemExit("nothing to approve: the cut has not been merged")
        rec["cut"] = {"sha": sha256_file(video.final), "at": now, "by": by}
    else:
        raise SystemExit(f"unknown gate {gate!r} (script or cut)")
    save(video, rec)
    return rec[gate]


def state(video):
    """{'script': open/approved/stale, 'cut': ..., 'budget_usd', 'spent_usd', 'left_usd'}"""
    rec = load(video)
    s = rec.get("script")
    c = rec.get("cut")
    spent = round(sum(x["usd"] for x in rec.get("spent", [])), 2)
    out = {
        "script": "open" if not s else ("approved" if s["sha"] == script_sha(video) else "stale"),
        "cut": "open" if not c else ("approved" if video.final.exists() and c["sha"] == sha256_file(video.final) else "stale"),
        "budget_usd": s["budget_usd"] if s else 0,
        "spent_usd": spent,
    }
    out["left_usd"] = round(out["budget_usd"] - spent, 2)
    return out


def allow(video, step, usd, yes=False):
    """May a paid step spend `usd` now? --yes (a human at the keyboard) always
    may; otherwise only a gated video with an approved script and budget."""
    if yes:
        return True
    if not enabled(video):
        return False
    st = state(video)
    if st["script"] != "approved":
        raise SystemExit(f"{step}: script gate is {st['script']}; a human must approve the script "
                         f"(approve {video.rel(video.dir)} script --budget N)")
    if usd > st["left_usd"] + 1e-9:
        raise SystemExit(f"{step}: needs about ${usd:.2f} but only ${st['left_usd']:.2f} of the "
                         f"${st['budget_usd']:.2f} budget is left; ask the human to raise it")
    return True


def record(video, step, usd, note=""):
    if not enabled(video) or usd <= 0:
        return
    rec = load(video)
    rec.setdefault("spent", []).append({"step": step, "usd": round(usd, 4), "note": note,
                                        "at": time.strftime("%Y-%m-%dT%H:%M:%S%z")})
    save(video, rec)


def check_publish(video):
    if enabled(video) and state(video)["cut"] != "approved":
        raise SystemExit("publish: the cut gate is not approved for the current file; "
                         "a human must watch the previews and approve the cut")


def voice_usd(video, chars):
    rate = video.meta.get("voice", {}).get("usd_per_1k_chars", VOICE_USD_PER_1K_CHARS)
    return chars / 1000 * rate
