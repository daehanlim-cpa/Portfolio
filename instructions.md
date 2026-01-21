# Developer Portfolio Website — Build Instructions (Antigravity)

## 0) Goal
Build a **minimal, high-end developer portfolio**:
- Visual feel: **Apple.com** (clean, whitespace, premium typography, subtle motion)
- Content layout: **Supreme** (simple product grid where each “product” is a portfolio project)
- Subpage: **Resume** page that includes a built-in **LLM chat** that answers questions using only the resume content.

Primary objectives:
1) Fast, clean, minimal UI
2) Mobile-first and responsive
3) Easy to update projects/resume content
4) Resume chat must be grounded, safe, and not hallucinate

---

## 1) Tech + Architecture
Preferred stack:
- Frontend: **Next.js (App Router)** + **TypeScript**
- Styling: **TailwindCSS**
- Animations: Framer Motion (subtle only)
- Hosting: Vercel (or equivalent)
- Content: **JSON or Markdown** files stored in repo (no CMS required)

Resume chat (RAG):
- LLM Provider: OpenAI (or equivalent)
- Embeddings: `text-embedding-3-large` (or comparable)
- Vector store: 
  - Option A: **SQLite + local vector index** (small resume)  
  - Option B: **Pinecone / Supabase Vector / Vercel Postgres + pgvector** (clean production)
- API route: `/api/resume-chat`

---

## 2) Site Map
Pages:
- `/` Home
- `/projects` Projects grid (can also be the home if you want)
- `/projects/[slug]` Project detail page
- `/resume` Resume page + chat widget
- `/about` (optional minimal “bio” page)
- `/contact` (optional; could just be footer links)

Navigation:
- Minimal top nav: **Logo/Name (left)** and **Projects / Resume / Contact (right)**
- Sticky nav with subtle blur on scroll

Footer:
- Email, GitHub, LinkedIn
- Copyright

---

## 3) Design System (Apple-like Minimal)
Typography:
- Use one modern sans-serif (e.g., Inter / SF-like)
- Size scale:
  - H1: big but not loud
  - H2/H3: clean, thin weight
  - Body: comfortable line height

Spacing:
- Large whitespace
- Consistent gutters and max width (e.g., 1100–1200px)

Color:
- Default light theme (white/off-white background)
- Neutral blacks/greys
- Optional dark mode toggle (only if easy)

Motion:
- On scroll: fade/slide in sections slightly
- Hover: subtle elevation or underline (no flashy effects)

---

## 4) Home Page Layout (Apple-style hero + minimal sections)
Hero:
- Large headline: “I build data + AI products.”
- Subheadline: one sentence value prop
- Two CTAs: “View Projects” + “Resume”
- Optional small “availability” pill or location

Sections below hero:
1) Featured Projects (show 4–6)
2) Skills / Stack (small, clean list)
3) Optional timeline (very minimal)
4) Footer

---

## 5) Projects: Supreme-style “Products” Grid
Core concept:
- Each project is displayed like a Supreme product tile:
  - Image thumbnail (or clean placeholder)
  - Project name
  - Category tag (e.g., Data, AI, Compliance, Web)
  - Short 1-line description
  - Optional year

Grid requirements:
- Responsive:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3–4 columns
- Sorting and filtering:
  - Default: newest first
  - Filter pills: All / AI / Data / Fintech / Open Source (configurable)
- “Add to cart” style is NOT needed—keep it clean.
- Clicking a tile opens project detail.

Project detail page:
- Hero: project name + 1-sentence pitch
- Links: Live demo / GitHub / Case study
- Sections:
  - Problem
  - What I built
  - Architecture (simple diagram optional)
  - Impact (metrics if any)
  - Tech stack
  - Screenshots (optional)

Project content source:
- Store in `/content/projects/*.md` or `/data/projects.json`
- Each project needs:
  - `title`
  - `slug`
  - `category`
  - `year`
  - `summary`
  - `stack` (array)
  - `links` (github/demo)
  - `thumbnail` (image path)
  - `body` (markdown)

---

## 6) Resume Page + “Chat with my Resume” (LLM)
Resume page layout:
- Left: Resume content (or a clean “resume cards” layout)
- Right (or bottom on mobile): Chat panel

Resume content:
- Store resume in `/content/resume.md` (single source of truth)
- Render it on the page with clean headings and sections

Chat widget requirements:
- UI:
  - Chat input + send button
  - Chat history
  - Suggested prompts (chips):
    - “Summarize your experience in 30 seconds”
    - “What projects match a Senior PM role?”
    - “What’s your Snowflake/dbt experience?”
    - “What industries have you worked in?”
- Behavior:
  - Answers must be grounded in resume content
  - If not found, say: “I don’t see that in the resume.”
  - Provide short bullet answers by default
  - Optional: show “sources” (snippets) underneath the answer

RAG flow (required):
1) Split resume into chunks (300–800 tokens)
2) Embed chunks once (build step or first run)
3) On query:
   - Embed question
   - Retrieve top-k chunks (k=4–8)
   - Send to LLM with system rules

Strict system rules for the resume assistant:
- Use only provided resume context
- Do not invent facts
- If unsure, ask a clarifying question or state not in resume
- Keep answers concise unless asked to expand

API contracts:
- POST `/api/resume-chat`
  - body: `{ messages: [{ role: "user"|"assistant", content: string }], sessionId?: string }`
  - returns: `{ reply: string, sources?: [{ text: string, section?: string }] }`

Logging:
- Store minimal analytics (count of questions), no sensitive data by default

---

## 7) Performance + SEO
Performance:
- Lighthouse target: 90+
- Optimize images (next/image)
- Keep animations minimal and lightweight
- Lazy load screenshots galleries

SEO:
- Page titles + meta descriptions
- OpenGraph tags
- Sitemap + robots.txt

Accessibility:
- Keyboard navigable
- Proper contrast
- Alt text on images

---

## 8) Content I Will Provide (Placeholders Until Then)
Use placeholders for now:
- Name
- Tagline
- About blurb
- Projects list (6–12 items)
- Resume markdown

Make it easy for me to update:
- All content editable in `/content` or `/data`
- No code changes needed to add a new project

---

## 9) Deliverables Checklist
- [ ] Apple-like minimalist UI implemented
- [ ] Supreme-style projects grid + filter
- [ ] Project detail pages
- [ ] Resume page rendering `resume.md`
- [ ] Resume chat using RAG with strict grounding
- [ ] Mobile responsive
- [ ] Deployed with environment variables for LLM keys
- [ ] README explaining how to update projects/resume and how the chat works

---

## 10) Environment Variables
- `OPENAI_API_KEY=...`
- `RESUME_EMBEDDING_MODEL=...` (default to embedding model)
- `RESUME_CHAT_MODEL=...` (default to fast chat model)

---

## 11) Done Criteria
The site is done when:
- Projects look like a clean “product grid”
- Page feels premium/minimal like Apple
- Resume chat answers accurately from resume content, refuses to guess, and works on mobile
