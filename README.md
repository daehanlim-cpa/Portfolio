# Daehan Lim — Portfolio

The personal site of Daehan Lim, CPA: Senior Forward Deployed Engineer building
production GenAI and data systems for regulated financial institutions.

**Positioning:** *Production AI, built to pass the audit.* The site argues one
idea in order: the claim (hero), the evidence (numbers and case studies), why
it's credible (the auditor-to-engineer career path), how the work gets done, and
what to do next (email, or ask the AI assistant).

## Pages

| Route | What it is |
| --- | --- |
| `/` | Narrative home page: hero with the animated governed-pipeline diagram and an "ask" box, impact figures, featured case studies, career timeline, method, credentials, writing, contact |
| `/work` | Every case study, filterable by type |
| `/project/[id]` | Full case study: results, context, problem and baseline, what was built, approach, architecture, controls, stack |
| `/ask` | The recruiter assistant, full page. `/ask?q=...` asks a question on arrival (used by the hero and the case-study pages) |
| `/writing`, `/blog/[slug]` | Posts in English and Korean |
| `/resume` | The full resume |

Old routes (`/experience`, `/projects`, `/professional`, `/purpose`, `/skill/*`, `/chat`) redirect to their new homes.

## Editing content

Nothing on the site needs a code change to update:

- **Home-page copy and figures:** `data/site.ts` (profile, headline metrics, featured case studies, timeline, method, credentials, stack, education). Every figure there comes from the resume or a case study. Keep it that way.
- **Case studies:** `data/projects.ts`. The optional `highlight` field is the big number on cards; take it verbatim from that project's `impact`.
- **Posts:** `data/blog.ts`.
- **Resume:** `content/resume.md` (also the assistant's source; re-run `npm run build:embeddings` after editing it or the projects).

## Design system

- **Tokens** live in `app/globals.css` as CSS variables and are mapped into Tailwind in `tailwind.config.ts`. Components only use tokens (`text-ink`, `bg-surface`, `text-on-ink`…), which is what makes dark mode work.
- **Dark mode** follows the OS by default. The nav toggle stores an explicit choice in `localStorage`, and an inline script applies it before first paint, so there is no flash.
- **Type:** Inter for everything, and Instrument Serif (italic) for display emphasis only.
- **Colour:** one near-black ink, evenly stepped greys, a blue `accent` for focus, and a `signal` orange reserved for "an exception a control caught".
- **Motion:** decelerating curves, small travel distances, one-time scroll reveals. Everything respects `prefers-reduced-motion`; the hero diagram's particles aren't drawn at all under it.

## SEO

`app/opengraph-image.tsx`, `app/icon.tsx` and `app/apple-icon.tsx` generate the social card and icons at build time. `app/sitemap.ts` and `app/robots.ts` cover crawling, and the root layout emits `Person` structured data.

## Tech stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Google Gemini (assistant) · Upstash (rate limiting)

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Recruiter Chat Setup

An AI assistant at `/chat` (also reachable from the chat icon in the nav) that answers
recruiter questions about Daehan's background and how it maps to a role they're hiring for.
Answers are grounded in `content/resume.md` and `data/projects.ts`.

### 1. Google API key

Get one from [Google AI Studio](https://makersuite.google.com/app/apikey), then create `.env.local`:

```bash
GOOGLE_API_KEY=your_key_here
```

### 2. Generate embeddings

```bash
npm run build:embeddings
```

This indexes the resume **and** every project case study, writing `data/embeddings.json`.
That file is committed, so production builds don't need an API key.

> **Re-run this whenever you edit `content/resume.md` or `data/projects.ts`** — otherwise
> the chat answers from stale content.

### 3. Rate limiting (required for production)

Create a free Redis database at [console.upstash.com](https://console.upstash.com) and add:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Without these the app falls back to in-memory counters that reset on every cold start —
fine locally, but **they will not protect your API budget in production**.

### How the cost and abuse controls work

Checks run cheapest-first, so abusive traffic is rejected before it can spend anything:

| Layer | Limit | Cost when it trips |
|---|---|---|
| Origin check | Requests must come from the site | Zero |
| Input caps | 1000 chars/message, 40 messages/conversation | Zero |
| Per-conversation | 30 messages | Zero |
| Per-IP | 45/hour, 90/day | Zero |
| **Global daily** | **500/day** (`CHAT_DAILY_GLOBAL_LIMIT`) | Zero — shows an "at capacity" state |
| Topic gate | Retrieval similarity below `CHAT_TOPIC_FLOOR` (0.57) | One embedding call — **never reaches the chat model** |

The topic gate is the main saver: off-topic questions are answered with a canned redirect
and never trigger generation. Quota is consumed in order, so a user who trips the
per-conversation cap never draws down the global daily budget.

### Follow-up suggestions

`/api/followups` generates the three suggestion chips shown under each answer on the
landing chat. It runs after the answer has finished streaming, taking the exchange plus an
inventory of what the corpus covers, and returns a short JSON array.

It is deliberately fenced off from the chat itself:

- **Its own budget.** A separate per-IP hourly window (60) and a separate global daily
  bucket of the same size as the chat's. Suggestions can never eat the day's answer
  capacity, and they never touch the per-conversation counter — a visitor shouldn't lose a
  question they could have asked because the UI generated chips on their behalf.
- **Failure is silent.** Every error path returns an empty array, and the client falls back
  to a static list. No API key, no Redis, a malformed model response, or a network drop all
  degrade to the same working UI.

The compact chat sheet doesn't call it at all; it uses the static list.

Transcripts are stored in Redis for 30 days (`chat:log:<sessionId>`, plus a `chat:recent`
list) so you can see what recruiters actually ask. Read them from the Upstash console.

## Deployment

Import the repository into Vercel and set `GOOGLE_API_KEY`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Anywhere else: `npm run build && npm run start`.
