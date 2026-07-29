# Daehan Lim - Minimal Portfolio

A minimalist portfolio website inspired by premium e-commerce storefronts. Features a clean product-grid layout with skillset filtering.

## Design Philosophy

- **Extremely minimal**: White background, generous whitespace, grayscale palette
- **Premium feel**: Subtle hover effects, smooth transitions (200-300ms)
- **Product-focused**: Projects displayed like products in an e-commerce grid
- **Category filtering**: Navigate by skillsets (Data Engineering, Cloud, etc.)

## Features

✅ **Product Grid Layout**
- Responsive: 2 columns (mobile) → 3 (tablet) →  5-6 (desktop)
- Centered project images with code labels (DL-01, DL-02, etc.)
- Subtle hover scale effect (1.05x)

✅ **Category Navigation**
- Sticky top nav with centered skillset filters
- Smooth filtering without page reload
- URL-based routing (`/skill/Data Engineering`)

✅ **E-Commerce Style Project Pages**
- Large image gallery on left
- Detailed specs on right (Problem, Approach, Impact)
- Tech stack tags and action buttons
- Next/Previous project navigation

✅ **AI Recruiter Chat**
- Grounded responses using Google Gemini RAG over the resume and project case studies
- Located at `/chat`, plus a launcher in the nav
- Streaming replies, topic guardrails, and durable rate limiting

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **AI**: Google Gemini
- **Font**: Inter

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Adding New Projects

### 1. Add Project Data

Edit `data/projects.ts` and add a new project:

```typescript
{
  id: "your-project-id",
  code: "DL-07",  // Use sequential code
  title: "Your Project Title",
  categories: ["Data Engineering", "Cloud"],  // Pick from existing categories
  heroImage: "/images/project7.png",
  galleryImages: ["/images/project7.png"],  // Optional additional images
  shortDescription: "One-sentence description",
  problem: [
    "Problem point 1",
    "Problem point 2"
  ],
  approach: [
    "Approach step 1",
    "Approach step 2"
  ],
  impact: [
    "Impact metric 1",
    "Impact metric 2"
  ],
  techStack: ["Tech1", "Tech2", "Tech3"],
  links: {
    demo: "https://demo.com",  // Optional
    repo: "https://github.com/...",  // Optional
    pdf: "/files/case-study.pdf"  // Optional
  }
}
```

### 2. Add Project Image

Place your image in `public/images/` folder:
- Recommended: PNG with transparent background
- Size: Square aspect ratio (1:1)
- Format: Clean product-shot style (centered, minimal)

### 3. Restart Dev Server

```bash
npm run dev
```

Your project will automatically appear in the grid!

## Available Categories

Current skillset categories:
- ALL
- Data Engineering
- Cloud
- Financial Services
- Analytics  
- Compliance
- DevOps
- Migration
- Governance
- Data Modeling

To add a new category, edit the `categories` array in `data/projects.ts`.

## Project Structure

```
Portfolio/
├── app/
│   ├── page.tsx                  # Homepage (product grid)
│   ├── layout.tsx                # Root layout with nav
│   ├── skill/[category]/         # Filtered category pages
│   ├── project/[id]/             # Project detail (PDP style)
│   └── resume/                   # Resume + AI chat
├── components/
│   ├── CategoryNav.tsx           # Top navigation bar
│   ├── ProjectCard.tsx           # Individual product card
│   └── ProjectGrid.tsx           # Responsive grid layout
├── data/
│   └── projects.ts               # All project data
└── public/images/                # Project images
```

## Customization

### Change Code Prefix

In `data/projects.ts`, update all `code` fields from "DL-XX" to your preferred prefix:
```typescript
code: "YourInitials-01"
```

### Adjust Grid Columns

In `components/ProjectGrid.tsx`:
```typescript
// Current: 2 → 3 → 5 → 6 columns
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"

// Change to 3 → 4 columns:
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
```

### Modify Hover Scale

In `components/ProjectCard.tsx`:
```typescript
// Current: 1.05x scale
className="... group-hover:scale-105"

// Change to 1.02x:
className="... group-hover:scale-102"
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
| Input caps | 500 chars/message, 12 messages/conversation | Zero |
| Per-conversation | 10 messages | Zero |
| Per-IP | 20/hour, 40/day | Zero |
| **Global daily** | **500/day** (`CHAT_DAILY_GLOBAL_LIMIT`) | Zero — shows an "at capacity" state |
| Topic gate | Retrieval similarity below `CHAT_TOPIC_THRESHOLD` (0.60) | One embedding call — **never reaches the chat model** |

The topic gate is the main saver: off-topic questions are answered with a canned redirect
and never trigger generation. Quota is consumed in order, so a user who trips the
per-conversation cap never draws down the global daily budget.

Transcripts are stored in Redis for 30 days (`chat:log:<sessionId>`, plus a `chat:recent`
list) so you can see what recruiters actually ask. Read them from the Upstash console.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables: `GOOGLE_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
4. Deploy!

### Other Platforms

Build the project:
```bash
npm run build
npm run start
```

## Design Principles

✨ **Minimalism**
- White background only
- No gradients or colors (except images)
- Generous spacing between elements

✨ **Typography**
- Light font weights (300-400)
- Uppercase labels with wide tracking
- Small, understated text sizes

✨ **Interactions**
- Subtle hover effects (opacity, scale)
- Smooth 200-300ms transitions
- No jarring animations

✨ **Layout**
- Centered, balanced compositions
- Consistent grid spacing
- Product-gallery aesthetic

## Browser Support

- Chrome, Safari, Firefox, Edge (latest versions)
- Mobile responsive on iOS and Android

---

**© 2026 Daehan Lim**
