# Daehan Lim — Portfolio

The personal site of Daehan Lim, CPA: Senior Forward Deployed Engineer building
production GenAI and data systems for regulated financial institutions.

**Positioning:** a Forward Deployed Engineer who learns how a business really
works, then builds the AI and data systems it runs on. Domain knowledge first,
builder second, and not tied to any single industry.

The home page is three acts in order: **(1) Forward Deployed Engineer**, what the
role is and how an engagement runs; **(2) the path** from domain expert to
builder; **(3) the work**, led by its numbers. Credentials, writing and contact
follow. The visual language follows Apple's: one idea per section, centered
statements, two-tone semibold headlines, generous space.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero, Forward Deployed Engineer, the path, the work (headline figures and featured case studies), credentials, writing, contact |
| `/work` | Every case study, filterable by type |
| `/project/[id]` | Full case study: metric scorecard, before/after, context, problem, what was built, approach, architecture, governance, stack |
| `/ask` | The recruiter assistant, full page. `/ask?q=...` asks a question on arrival (used by the hero and the case-study pages) |
| `/writing`, `/blog/[slug]` | Posts in English and Korean |
| `/resume` | The full resume |

Old routes (`/experience`, `/projects`, `/professional`, `/purpose`, `/skill/*`, `/chat`) redirect to their new homes.

## Editing content

Nothing on the site needs a code change to update:

- **Home-page copy and figures:** `data/site.ts` (profile, headline metrics, featured case studies, timeline, method, credentials, stack, education). Every figure there comes from the resume or a case study. Keep it that way.
- **Case studies:** `data/projects.ts`. Each project's `metrics` array is its scorecard, and the first one or two appear on cards. **Never estimate a figure.** Every value must appear in the project's own text. Where nothing was measured, use a scope count from the text or a directional word ("Faster") and explain it in `metricsNote`. The page shows that note under the scorecard.
- **Posts:** `data/blog.ts`.
- **Resume:** `content/resume.md`.

The AI assistant reads all of the above on every question, so whatever the site says, it knows. Nothing needs rebuilding.

## Design system

- **Tokens** live in `app/globals.css` as CSS variables and are mapped into Tailwind in `tailwind.config.ts`. Components only use tokens (`text-ink`, `bg-surface`, `text-on-ink`…), which is what makes dark mode work.
- **Dark mode** follows the OS by default. The nav toggle stores an explicit choice in `localStorage`, and an inline script applies it before first paint, so there is no flash.
- **Type:** Inter only. Headlines are semibold with tight tracking, and the qualifying half of each is set in grey.
- **Colour:** one near-black ink, evenly stepped greys, and a blue `accent` for links and focus.
- **Motion:** decelerating curves, small travel distances, one-time scroll reveals. Everything respects `prefers-reduced-motion`.

## SEO

`app/opengraph-image.tsx`, `app/icon.tsx` and `app/apple-icon.tsx` generate the social card and icons at build time. `app/sitemap.ts` and `app/robots.ts` cover crawling, and the root layout emits `Person` structured data.

## Tech stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Claude API (assistant) · Upstash (rate limiting)

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Recruiter Chat Setup

An AI assistant at `/ask` (and the "Ask AI" sheet in the nav) that answers questions about
Daehan's background and how it maps to a role. It runs on the Claude API
(`claude-haiku-4-5` by default).

### 1. API key

Create a key at [platform.claude.com](https://platform.claude.com) (Settings → API keys),
then set it locally in `.env.local` and in Vercel (Project → Settings → Environment
Variables):

```bash
ANTHROPIC_API_KEY=sk-ant-...
```

**Set a spend limit** under Settings → Billing, for example $5/month. When it's reached,
the assistant shows its "unavailable" message instead of spending more.

### 2. How it answers

The whole website is small (about 13k tokens), so instead of searching it, the assistant
is given **all of it** on every question: the home page, the resume, every case study and
every blog post (`lib/corpus.ts`). Prompt caching makes the repeat reads cost a tenth of
the normal input price, so a question costs well under a cent on Haiku. There's no index
to rebuild: edit `content/resume.md`, `data/*.ts` or a post, redeploy, and the assistant
knows.

All model access goes through `lib/llm.ts`. Change models with `RESUME_CHAT_MODEL`. Each
answer logs one `[llm]` line with its token usage and cache hits.

### 3. Rate limiting (required for production)

Create a free Redis database at [console.upstash.com](https://console.upstash.com) and add:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Without these the app falls back to in-memory counters that reset on every cold start —
fine locally, but **they will not protect your API spend in production**.

### How the cost and abuse controls work

Checks run cheapest-first, so abusive traffic is rejected before it can spend anything:

| Layer | Limit | Cost when it trips |
|---|---|---|
| Origin check | Requests must come from the site | Zero |
| Input caps | 1000 chars/message, 40 messages/conversation | Zero |
| Per-conversation | 30 messages | Zero |
| Per-IP | 45/hour, 90/day | Zero |
| **Global daily** | **500/day** (`CHAT_DAILY_GLOBAL_LIMIT`) | Zero — shows an "at capacity" state |
| Greeting | "hi", "hello" and similar | Zero — canned reply, no API call |
| Answer size | 2,048 output tokens max | Caps the cost of any single answer |

Quota is consumed in order, so a user who trips the per-conversation cap never draws down
the global daily budget. Off-topic questions reach the model, which steers back to
Daehan's work; with the site content cached, each costs a fraction of a cent. Your
Console spend limit is the final backstop.

### Follow-up suggestions

`/api/followups` generates the three suggestion chips shown under each answer on the
chat page. It runs after the answer has finished streaming, taking the exchange plus the
same cached site content as the chat, and returns JSON constrained by a schema.

It is deliberately fenced off from the chat itself:

- **Its own budget.** A separate per-IP hourly window (60) and a separate global daily
  bucket of the same size as the chat's. Suggestions can never eat the day's answer
  capacity, and they never touch the per-conversation counter — a visitor shouldn't lose a
  question they could have asked because the UI generated chips on their behalf.
- **Failure is silent.** Every error path returns an empty array, and the client falls back
  to a static list. No API key, no Redis, a malformed model response, or a network
  drop all degrade to the same working UI.

The compact chat sheet doesn't call it at all; it uses the static list.

Transcripts are stored in Redis for 30 days (`chat:log:<sessionId>`, plus a `chat:recent`
list) so you can see what recruiters actually ask. Read them from the Upstash console.

## Deployment

Import the repository into Vercel and set `ANTHROPIC_API_KEY`, `UPSTASH_REDIS_REST_URL` and
`UPSTASH_REDIS_REST_TOKEN`. Anywhere else: `npm run build && npm run start`.
