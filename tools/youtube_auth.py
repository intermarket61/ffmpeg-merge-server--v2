#!/usr/bin/env python3
"""One-time YouTube authorisation. Run this on YOUR OWN computer (it opens a
browser), not in a cloud session. Prints the YOUTUBE_REFRESH_TOKEN the
pipeline needs.

Before running it, in Google Cloud Console (console.cloud.google.com):
  1. Create a project, then APIs & Services > Library > enable
     "YouTube Data API v3".
  2. APIs & Services > OAuth consent screen: External. Then press
     "Publish app" so its status is "In production". Left in "Testing",
     Google expires the refresh token after 7 days and automated uploads
     stop. You'll see an "unverified app" warning when you sign in: that's
     expected for your own app; choose Advanced > continue.
  3. APIs & Services > Credentials > Create credentials > OAuth client ID >
     Application type "Desktop app". Copy the client ID and secret.

Then:  python3 tools/youtube_auth.py <client_id> <client_secret>
and sign in with the Google account that owns the channel.
"""
import http.server
import json
import secrets
import sys
import urllib.parse
import urllib.request
import webbrowser

SCOPES = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl"
PORT = 8765


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    client_id, client_secret = sys.argv[1:]
    redirect = f"http://127.0.0.1:{PORT}/"
    state = secrets.token_urlsafe(16)
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
        "client_id": client_id, "redirect_uri": redirect, "response_type": "code",
        "scope": SCOPES, "access_type": "offline", "prompt": "consent", "state": state})
    got = {}

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            got.update({k: v[0] for k, v in q.items()})
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Done. You can close this tab and return to the terminal.")

        def log_message(self, *a):
            pass

    print("Opening your browser to sign in. If it doesn't open, visit:\n" + url)
    webbrowser.open(url)
    server = http.server.HTTPServer(("127.0.0.1", PORT), Handler)
    while "code" not in got and "error" not in got:
        server.handle_request()
    if got.get("state") != state or "code" not in got:
        sys.exit(f"authorisation failed: {got.get('error', 'state mismatch')}")
    body = urllib.parse.urlencode({"code": got["code"], "client_id": client_id,
                                   "client_secret": client_secret, "redirect_uri": redirect,
                                   "grant_type": "authorization_code"}).encode()
    tokens = json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", data=body))
    if "refresh_token" not in tokens:
        sys.exit(f"no refresh token returned: {tokens}")
    print("\nAdd these to the environment's secrets:\n")
    print(f"YOUTUBE_CLIENT_ID={client_id}")
    print(f"YOUTUBE_CLIENT_SECRET={client_secret}")
    print(f"YOUTUBE_REFRESH_TOKEN={tokens['refresh_token']}")


if __name__ == "__main__":
    main()
