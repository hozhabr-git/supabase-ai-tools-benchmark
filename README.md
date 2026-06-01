# AI Tools Benchmark With Next and Supabase

A modern web app to **search**, **catalog**, and **compare** AI tools (ChatGPT, Gemini, Claude, Midjourney, and more). Built with **Next.js** and **Supabase**.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ecf8e?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)

## Features

- **Live search** — debounced search across name, provider, category, and tags
- **Tool cards** — pricing badge, tags, publish date, and link to detail page
- **Add tools** — form at `/tools/add` with validation via API
- **Tool detail** — full description, metadata, and external website link
- **Copy link** — copies only the tool page URL; a dialog shows the exact copied value
- **Delete with confirmation** — modal dialog before permanent delete (no browser `confirm`)
- **Dark UI** — gradient hero, glassmorphism cards, responsive grid

## Screenshots

_Add screenshots after deploy (home search, tool detail, add form)._

## Tech stack

| Layer      | Choice                          |
| ---------- | ------------------------------- |
| Framework  | Next.js 16 (App Router)         |
| UI         | React 19, Tailwind CSS 4        |
| Icons      | Lucide React                    |
| Database   | Supabase (PostgreSQL)           |
| Client SDK | `@supabase/supabase-js`         |

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- A [Supabase](https://supabase.com/) project (free tier is enough)

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/ai-tools-benchmark.git
cd ai-tools-benchmark
npm install
```

### 2. Environment variables

Copy the example file and fill in your Supabase credentials from **Project Settings → API**:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key
```

> Never commit `.env.local` or real keys to Git.

### 3. Database schema

In the Supabase Dashboard, open **SQL Editor** and run the full script:

[`supabase/schema.sql`](./supabase/schema.sql)

This creates:

- `ai_tools` table with indexes
- Row Level Security policies (public read/write for demo; tighten for production)
- Optional seed rows (ChatGPT, Gemini, Claude, etc.)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Production build

```bash
npm run build
npm start
```

### 6. Deploy live (Vercel)

This app needs a Node/Next host (not static-only hosts like Surge). See **[DEPLOY.md](./DEPLOY.md)** for step-by-step deploy (CLI, GitHub import, or GitHub Actions).

```bash
npx vercel@latest login
./scripts/deploy-vercel.sh
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the Vercel project settings, then redeploy.

## Project structure

```
src/
  app/
    page.tsx                 # Home + search
    tools/add/page.tsx       # Add tool form
    tools/[id]/page.tsx      # Tool detail
    api/tools/route.ts       # GET (search), POST (create)
    api/tools/[id]/route.ts  # DELETE
  components/
    SearchHero.tsx           # Hero, search input, results grid
    ToolCard.tsx             # Card layout
    ToolHoverActions.tsx     # Copy link & delete (with dialogs)
    ConfirmDialog.tsx        # Delete confirmation
    CopyFeedbackDialog.tsx   # Shows copied URL only
    AddToolForm.tsx
    Header.tsx
  lib/
    supabase/                # Browser & server clients
    tools.ts                 # Data access helpers
  types/
    ai-tool.ts
supabase/
  schema.sql
```

## API overview

| Method | Path              | Description                    |
| ------ | ----------------- | ------------------------------ |
| `GET`  | `/api/tools?q=`   | List/search tools              |
| `POST` | `/api/tools`      | Create a tool (JSON body)      |
| `DELETE` | `/api/tools/[id]` | Delete a tool by UUID        |

## Data model (`ai_tools`)

| Column          | Type        | Notes                                      |
| --------------- | ----------- | ------------------------------------------ |
| `id`            | `uuid`      | Primary key                                |
| `name`          | `text`      | Required                                   |
| `provider`      | `text`      | e.g. OpenAI, Google                        |
| `description`   | `text`      | Default empty string                       |
| `website_url`   | `text`      | Optional                                   |
| `category`      | `text`      | Default `general`                          |
| `pricing_model` | `text`      | `free`, `freemium`, `paid`, `enterprise`   |
| `tags`          | `text[]`    | PostgreSQL array                           |
| `created_at`    | `timestamptz` | Auto-set                               |

## Security note

The included RLS policies allow **anonymous** insert/update/delete for simplicity in learning and demos. Before a public deployment, restrict writes to authenticated users or server-side service roles only.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Development server       |
| `npm run build`| Production build         |
| `npm start`    | Run production server    |
| `npm run lint` | ESLint                   |

## License

MIT — use and modify freely. Replace this section if you choose another license.

## Contributing

Issues and pull requests are welcome. For large changes, open an issue first to discuss what you would like to change.
