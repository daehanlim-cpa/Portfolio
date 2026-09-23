# Running the AI assistant on a Mac mini with Ollama

The site's assistant (`/ask`, and the chat sheet on every page) runs on your own
hardware through [Ollama](https://ollama.com). No cloud API key is needed. The site
talks to Ollama for two things:

| Job | Default model | When |
|---|---|---|
| Embeddings (search) | `nomic-embed-text` | Once per question, and when rebuilding the index |
| Chat answers + follow-up chips | `qwen2.5:7b` | Once per on-topic question |

If the Mac mini is off or unreachable, the assistant shows "isn't available right now"
with your email address. The rest of the site keeps working.

---

## 1. Install Ollama and the models (on the Mac mini)

```bash
brew install ollama            # or download the app from ollama.com
brew services start ollama     # runs now, and at every login
ollama pull nomic-embed-text
ollama pull qwen2.5:7b
```

Pick the chat model by the Mac's memory. Set it with `RESUME_CHAT_MODEL` (see step 4):

| Unified memory | Chat model | Notes |
|---|---|---|
| 16 GB | `qwen2.5:7b` (default) or `llama3.1:8b` | Fast; follows the guardrails well |
| 24 GB+ | `gemma3:12b` or `qwen2.5:14b` | Noticeably better answers |
| 32 GB+ | `qwen2.5:32b` or `gemma3:27b` | Best quality; slower first token |

> If you choose a model that "thinks" by default (for example `qwen3`), set
> `OLLAMA_THINK=false`. The reasoning is never shown, but it delays the answer.

**Keep the Mac awake.** In System Settings → Energy, turn on *Prevent automatic sleeping
when the display is off* and *Start up automatically after a power failure*.

## 2. Build the search index (whenever the resume or projects change)

On the Mac mini, in a checkout of this repository:

```bash
npm install
npm run build:embeddings
git add data/embeddings.json && git commit -m "Rebuild assistant index" && git push
```

This embeds `content/resume.md` and every case study in `data/projects.ts`. It also
**measures the topic-gate thresholds** against the new index and stores them in the same
file. Nothing needs tuning by hand. The output shows the measured score bands.

The index records which embedding model built it. If the site is configured with a
different model, the assistant refuses to answer rather than search with incompatible
vectors, and logs: *"embeddings.json was built with X but Y is configured"*. Rebuilding
fixes it.

> **Re-run this after every edit to `content/resume.md` or `data/projects.ts`,**
> otherwise the assistant answers from stale content.

## 3. Connect the website to the Mac mini

Ollama has **no authentication**. Never expose port 11434 to the internet with router
port-forwarding: anyone could use your machine. Choose one of these instead.

### Option A — Site stays on Vercel, Ollama behind a Cloudflare Tunnel (recommended)

The tunnel makes an outbound-only connection from the Mac, so no ports are opened.
Cloudflare Access then admits only requests carrying your service token. This needs the
domain's DNS on Cloudflare; the free plan is enough.

1. **Create the tunnel** (on the Mac mini):

   ```bash
   brew install cloudflared
   cloudflared tunnel login
   cloudflared tunnel create ollama
   cloudflared tunnel route dns ollama ollama.daehanlim.com
   ```

   Create `~/.cloudflared/config.yml`. Use the tunnel ID that `create` printed:

   ```yaml
   tunnel: <TUNNEL-ID>
   credentials-file: /Users/<you>/.cloudflared/<TUNNEL-ID>.json
   ingress:
     - hostname: ollama.daehanlim.com
       service: http://localhost:11434
       originRequest:
         httpHostHeader: localhost:11434   # Ollama expects a local Host header
     - service: http_status:404
   ```

   Run it as a service so it survives reboots:

   ```bash
   sudo cloudflared service install
   ```

2. **Lock it down** in the Cloudflare dashboard → Zero Trust:
   - *Access → Service Auth → Service Tokens → Create*. Copy the **Client ID** and
     **Client Secret**; the secret is shown only once.
   - *Access → Applications → Add → Self-hosted*, domain `ollama.daehanlim.com`. Add a
     policy with **Action: Service Auth** that includes that service token.

3. **Check it** from any other machine:

   ```bash
   # Rejected (403) — no token:
   curl -i https://ollama.daehanlim.com/api/tags
   # Allowed — with the token:
   curl https://ollama.daehanlim.com/api/tags \
     -H "CF-Access-Client-Id: <id>" -H "CF-Access-Client-Secret: <secret>"
   ```

4. **Set the Vercel environment variables** (Project → Settings → Environment Variables),
   then redeploy:

   ```
   OLLAMA_BASE_URL=https://ollama.daehanlim.com
   CF_ACCESS_CLIENT_ID=<id>
   CF_ACCESS_CLIENT_SECRET=<secret>
   ```

### Option B — Host the whole site on the Mac mini

If the site runs on the same machine, Ollama stays private on `localhost` and needs no
extra setup:

```bash
npm run build && npm start      # serves on :3000
```

Point a Cloudflare Tunnel ingress for `daehanlim.com` at `http://localhost:3000`, using the
same steps as above but **without** the `httpHostHeader` line. The site then depends on
the Mac being up, not only the assistant.

## 4. Configuration reference

All optional. Defaults assume Ollama on the same machine.

| Variable | Default | Purpose |
|---|---|---|
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` | Where Ollama is reachable |
| `CF_ACCESS_CLIENT_ID` / `CF_ACCESS_CLIENT_SECRET` | — | Cloudflare Access service token (Option A) |
| `OLLAMA_API_KEY` | — | Sent as `Authorization: Bearer …`, for your own reverse proxy |
| `RESUME_CHAT_MODEL` | `qwen2.5:7b` | Chat model tag |
| `RESUME_EMBEDDING_MODEL` | `nomic-embed-text` | Embedding model tag. **Changing it requires a rebuild** |
| `OLLAMA_NUM_CTX` | `16384` | Context window. Keep ≥ 12k: overflow silently drops the system prompt |
| `OLLAMA_KEEP_ALIVE` | `30m` | How long a model stays loaded after a request |
| `OLLAMA_TIMEOUT_MS` | `45000` | Wait for the first response byte (covers a cold model load) |
| `OLLAMA_THINK` | unset | `false` for models that reason by default |
| `CHAT_TOPIC_THRESHOLD` / `CHAT_TOPIC_FLOOR` | measured | Override the stored topic-gate thresholds |

## What to expect

- **The first question after 30 minutes idle** waits a few seconds while the model loads.
  After that, a 7B model on Apple silicon streams quickly.
- **Your Mac's compute is the budget now.** The existing limits still apply: per
  conversation, per IP, and a site-wide daily cap (`CHAT_DAILY_GLOBAL_LIMIT`, default
  500). Off-topic questions cost one embedding and never reach the chat model.
- **Inspect the gate** at any time with `npm run calibrate:topic`, which prints each probe
  question's score against the committed index.
