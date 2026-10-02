# Video E: recording guide

**Your Leads Are Slipping Through? Here's the 10-Minute n8n Fix**
Self-hosted n8n (Hetzner) · Google Sheets + Gmail · Telegram · n8n Form Trigger

You record the screen; the narration is already voiced and the avatar
appears only three times (open, halfway, close). Record **13 clips**, one
per section below, named exactly `s01.mp4` … `s13.mp4`. Don't narrate and
don't rush: I fit each clip under its narration in the edit (speeding up
typing and waiting, cutting dead time), so slow and clean beats fast.

---

## Before you record

**Accounts and things to have ready**
- Your n8n at its real domain (e.g. `https://n8n.yourdomain.com`), logged in.
- A Google account for the demo (your business one, or a demo account).
- Telegram on your phone **and Telegram Web** (web.telegram.org) open in a
  browser tab, so alerts arriving can be filmed on the same screen.
- A second email address to play the customer in the live run.

**Check two server settings first (self-hosted)**
- `WEBHOOK_URL` is set to your real domain with a trailing slash
  (`WEBHOOK_URL=https://n8n.yourdomain.com/`). Without it the form's
  production URL shows `localhost:5678` and nobody can reach it.
- `GENERIC_TIMEZONE` is set to your timezone (e.g. `America/Chicago`). If
  unset, n8n uses `America/New_York`.
- After changing either, restart n8n (`docker compose up -d`).

**Screen recording settings**
- 16:9 at **1920×1080** (2560×1440 is even better: I zoom into settings
  panels and the extra pixels keep text sharp). On a Mac, record a
  16:9 window or region, not the whole 16:10 screen.
- Browser: one window, bookmarks bar hidden, unrelated tabs closed,
  notifications off (Focus/Do Not Disturb), zoom 110–125% so text reads
  on a phone.
- n8n theme: pick light or dark and keep it for every clip.
- Mouse: move deliberately, pause about a second after each click and
  after each value you type, so viewers can read it.
- Mistakes: just redo the step in the same clip. I'll cut it.

**Secrets**
- Never show the Google **client secret** or the Telegram **bot token** in
  full. If one appears on screen anyway, tell me the clip and roughly
  when; I blur it in the edit (the pipeline has blur boxes).
- Same for real customer emails: use the demo lead details below.

**Demo lead details (use these in every test)**
- Name: `Dana Ruiz` (type a couple of leading/trailing spaces on purpose
  in one test so the trim shows)
- Email: your second address, typed with a capital letter
  (e.g. `Dana.Ruiz@yourdomain.com`)
- Phone: `555 0142`
- What do you need?: `Quote for a kitchen refit, hoping to start in March`

---

## s01 · Prepare the sheet  (~20 s of narration)

1. Google Sheets → **Blank spreadsheet** → rename it **Leads**.
2. In row 1, type these headers, one per column, exactly:

   `received_at` · `name` · `email` · `phone` · `need` · `source` · `status` · `replied_at`
3. Optional: bold row 1 and freeze it (View → Freeze → 1 row). Leave the
   tab name as `Sheet1`.

## s02 · Step 1: the form trigger  (~1 min 20 s)

1. n8n → **Create workflow**. Rename it (top left) **Lead catcher**.
2. **Add first step** → search `form` → **On form submission**.
3. **Form Title**: `Get a quote`. Form Description (optional):
   `Tell us what you need and we'll get back to you.`
4. **Form Elements** → add four:
   | Field Label | Element Type | Required |
   |---|---|---|
   | `Name` | Text | on |
   | `Email` | Email | on |
   | `Phone` | Text | off |
   | `What do you need?` | Textarea | on |
5. **Respond When**: `Form Is Submitted`.
6. **Options** → Add option → the completion/submitted message (named
   *Form Submitted Text* or *Completion message* depending on version):
   `Thanks, we've got it. Check your inbox in the next minute.`
7. Click **Execute step** (*Test step* in older versions). The test form
   opens in a new tab. Fill it in with the demo lead and submit.
8. Back on the canvas, show the output panel: `Name`, `Email`, `Phone`,
   `What do you need?`, `submittedAt`, `formMode`.
9. Click the **pin** icon on the output panel (Pin data).

## s03 · Step 2: Tidy lead  (~45 s)

1. Click **+** after the trigger → **Edit Fields (Set)**. Rename it
   **Tidy lead** (exactly this: later steps refer to it by name).
2. **Mode**: `Manual Mapping`. Add seven fields (type **String** unless noted):
   | Name | Value |
   |---|---|
   | `name` | `{{ $json.Name.trim() }}` |
   | `email` | `{{ $json.Email.trim().toLowerCase() }}` |
   | `phone` | drag `Phone` from the input (`{{ $json.Phone }}`) |
   | `need` | drag `What do you need?` (`{{ $json['What do you need?'] }}`) |
   | `received_at` | `{{ $now.toFormat('yyyy-MM-dd HH:mm') }}` |
   | `source` | `quote form` |
   | `status` | `new` |
   Show the expression editor once (for `name`) so viewers see it.
3. **Include Other Input Fields**: off.
4. **Execute step** and show the clean output on the right.

## s04 · Google sign-in for self-hosted n8n  (~1 min 20 s)

1. console.cloud.google.com → project picker → **New project** → name it
   `n8n` → Create, and select it.
2. **APIs & Services → Library**: enable **Google Sheets API**,
   **Google Drive API**, **Gmail API** (search each, click Enable).
3. **Google Auth Platform / OAuth consent screen** → Get started:
   app name `n8n`, your email as support email, Audience **External**,
   contact email, agree, Create. Under **Audience → Test users**, add
   your own Google address.
4. In n8n, open a new **Google Sheets OAuth2 API** credential
   (Credentials → Add credential, or from the Sheets node in s05) and copy
   the **OAuth Redirect URL** it shows. It must start with your domain,
   e.g. `https://n8n.yourdomain.com/rest/oauth2-credential/callback`. If it
   says localhost, fix `WEBHOOK_URL` first.
5. Back in Google: **Clients → Create client** → Application type
   **Web application** → name `n8n` → **Authorised redirect URIs** → paste
   the URL → Create. Copy the **Client ID** and **Client secret** (keep the
   secret off screen).
6. In n8n paste both into the credential → **Sign in with Google** →
   choose your account → you'll see "Google hasn't verified this app":
   **Continue** → allow → "Connection successful".
7. Then show, briefly: Google console → **Audience** → **Publish app**
   (→ In production). This stops the 7-day sign-in expiry.

## s05 · Step 3: Save lead  (~50 s)

1. **+** after Tidy lead → **Google Sheets** → **Append or update row in
   sheet**. Rename it **Save lead**.
2. Credential: the one from s04. **Document**: From list → `Leads`.
   **Sheet**: From list → `Sheet1`.
3. **Mapping Column Mode**: `Map Each Column Manually`.
   **Column to match on**: `email`.
4. Fill the columns by dragging from Tidy lead's output (names match):
   `received_at`, `name`, `email`, `phone`, `need`, `source`, `status`.
   Leave `replied_at` empty.
5. **Options** → **Cell Format** → `Let Google Sheets format`
   (if your version doesn't have it, skip; tell me and I'll adjust the line).
6. **Execute step**, then switch to the Leads tab: the test lead in row 2.

## s06 · Step 4: Reply to lead  (~55 s)

1. **+** after Save lead → **Gmail** → **Send a message**. Rename it
   **Reply to lead**.
2. Credential: **Create new** → **Gmail OAuth2 API** → the same Client ID
   and secret → **Sign in with Google** → allow sending email.
3. **To**: `{{ $('Tidy lead').item.json.email }}`
4. **Subject**: `Got your message, {{ $('Tidy lead').item.json.name }}`
5. **Email Type**: `Text`.
6. **Message** (edit the business name and timing to yours):
   ```
   Hi {{ $('Tidy lead').item.json.name }},

   Thanks for getting in touch. Here's what happens next: I'll look at what you sent and reply properly by noon tomorrow.

   One quick question so that reply is useful: when are you hoping to start?

   Sam
   Your Business
   ```
7. **Options** → **Append n8n Attribution**: off. (Optional: **Sender
   Name**: your business name.)
8. **Execute step**, and show the email arriving in the second inbox.

## s07 · Step 5: Telegram alert  (~1 min 10 s)

1. Telegram → search **@BotFather** (blue tick) → `/newbot` → name
   `Lead alerts` → username ending in `bot` (e.g. `yourbiz_leads_bot`).
   Copy the token (**don't show it in full**).
2. Open your new bot → **Start** → send it any message (`hi`).
3. In the browser, open
   `https://api.telegram.org/bot<TOKEN>/getUpdates` (your token in place of
   `<TOKEN>`; hide the address bar or I'll blur it). Find
   `"chat":{"id": 123456789` and copy that number.
4. n8n: **+** after Reply to lead → **Telegram** → **Send a text
   message**. Rename it **Alert me**.
5. Credential: **Create new** → paste the token → Save.
6. **Chat ID**: the number.
7. **Text**:
   ```
   🆕 New lead: {{ $('Tidy lead').item.json.name }}
   {{ $('Tidy lead').item.json.need }}
   {{ $('Tidy lead').item.json.email }} · {{ $('Tidy lead').item.json.phone }}
   Sheet: <paste your Leads sheet URL>
   ```
8. **Additional Fields** → **Append n8n Attribution**: off.
9. **Execute step**; show the message arriving in Telegram Web.

*(Avatar segment plays here in the video: nothing to record.)*

## s08 · Step 6: Wait until next working morning  (~50 s)

1. **+** after Alert me → **Wait**. Rename it
   **Wait until next working morning**.
2. **Resume**: `At Specified Time`.
3. **Date and Time**: switch to **Expression** and paste:
   ```
   {{ $now.plus({ days: $now.weekday >= 5 ? 8 - $now.weekday : 1 }).set({ hour: 9, minute: 0, second: 0, millisecond: 0 }).toISO() }}
   ```
   The preview under the field shows the resulting date: point at it.
4. Workflow menu (⋯ top right) → **Settings** → **Timezone**: your
   timezone → Save.

## s09 · Step 7: Still new?  (~55 s)

1. **+** after the Wait → **Google Sheets** → **Get row(s) in sheet**.
   Rename it **Look up lead**. Same credential, `Leads`, `Sheet1`.
2. **Filters** → Add filter → **Column** `email`, **Value**
   `{{ $('Tidy lead').item.json.email }}`.
3. **+** → **If**. Rename it **Still new?**. Condition:
   `{{ $json.status }}` · **String → is equal to** · `new`.
4. On the **true** output: **+** → **Telegram** → Send a text message.
   Rename it **Remind me**. Same credential and Chat ID. Text:
   ```
   ⏰ {{ $('Tidy lead').item.json.name }} has waited since {{ $('Tidy lead').item.json.received_at }}. Nobody has replied yet.
   ```
   Append n8n Attribution: off.
5. Leave the **false** output empty. **Save**.

## s10 · The alarm, then go live  (~1 min 20 s)

1. New workflow → rename **Lead alarm** → add first step **Error Trigger**.
2. **+** → **Telegram** → Send a text message, same credential and Chat
   ID. Text:
   ```
   ⚠️ {{ $json.workflow.name }} failed at {{ $json.execution.lastNodeExecuted }}
   {{ $json.execution.error.message }}
   {{ $json.execution.url }}
   ```
   Append n8n Attribution: off. **Save**.
3. Back to **Lead catcher** → ⋯ → **Settings** → **Error workflow**:
   `Lead alarm` → Save.
4. Switch Lead catcher **on**: the **Active** toggle (n8n 1.x) or
   **Publish** (n8n 2.x).
5. Open **On form submission** → switch to **Production URL** → copy it.
   Show that it starts with your domain, not localhost.

## s11 · Live run, first lead  (~45 s)

Before recording: open **Wait until next working morning**, set
**Resume** to `After Time Interval`, **1 minute**, and make it live again
(save/publish). Film that change at the start of the clip.

1. Open the production form URL in a fresh tab. Fill it in as Dana Ruiz
   (second email) → Submit → completion message.
2. Switch to Telegram Web: the 🆕 alert.
3. Switch to the second inbox: the reply (no n8n footer).
4. Switch to the sheet: the new row, `status` = `new`.

## s12 · Live run, the next-day check  (~45 s)

1. n8n → Lead catcher → **Executions**: the run shows **Waiting**.
2. Wait out the minute (I'll cut it). Show the ⏰ reminder in Telegram, and
   the execution finished (open it: true branch ran).
3. Submit a **second** lead (another name/email). In the sheet, change its
   `status` to `replied` straight away.
4. After the minute: no reminder; open that execution and show it stopped
   at **Still new?** (false).

## s13 · Break it on purpose  (~40 s)

1. Open **Tidy lead** → `name` value → change to
   `{{ $json.Nmae.trim() }}` (typo on purpose) → make it live.
2. Submit one more lead on the production form.
3. Telegram: the ⚠️ **Lead alarm** message with the node and error.
4. Fix the typo back to `{{ $json.Name.trim() }}` → make it live.
5. Set the Wait back to **At Specified Time** with the expression → make it
   live. (The close of the video reminds viewers of this.)

---

## Sending me the clips

Upload all 13 to the S3 bucket under
`videos/video-e/screen/` (same bucket as the published videos), keeping
the names `s01.mp4` … `s13.mp4`. Or put them in one Google Drive folder and
send me the link. Tell me if any secret or private email showed on screen,
and roughly when.

Then I fit each clip under its narration, add the zooms, highlight boxes
and setting call-outs, blur anything sensitive, render, and send you
stills before anything is published.
