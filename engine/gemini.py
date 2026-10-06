"""Small Gemini API client shared by `analyze` (video understanding) and
`images` (still generation). The key is read from GEMINI_API_KEY and never
printed; error messages are scrubbed of it."""
import json
import time
import urllib.error
import urllib.request

from .util import env

API = "https://generativelanguage.googleapis.com/v1beta/models"


def call(model, method, body, timeout=600, retries=2):
    key = env("GEMINI_API_KEY")
    req = urllib.request.Request(f"{API}/{model}:{method}", data=json.dumps(body).encode(),
                                 headers={"x-goog-api-key": key, "Content-Type": "application/json"})
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:600].replace(key, "***")
            # 429/5xx are transient; anything else is a real error (and unbilled)
            if e.code in (429, 500, 503) and attempt < retries:
                time.sleep(15 * (attempt + 1))
                continue
            raise SystemExit(f"Gemini {model}:{method}: HTTP {e.code} {msg}")


def count_tokens(model, contents, config=None):
    """Free. Returns (total, {modality: tokens})."""
    req = {"model": f"models/{model}", "contents": contents}
    if config:
        req["generationConfig"] = config
    d = call(model, "countTokens", {"generateContentRequest": req})
    return d["totalTokens"], {p["modality"]: p["tokenCount"] for p in d.get("promptTokensDetails", [])}
