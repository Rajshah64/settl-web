# Settl Web

Retro-brutalist frontend for Settl (Chroma-inspired: cream canvas, ink borders, burnt amber accent).

## Run locally

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

App: [http://localhost:3001](http://localhost:3001)  
API (separate repo): `http://localhost:3000` — enable CORS for `:3001` (see settl-api `main.ts` / `CORS_ORIGINS`).

## Phase 1 (this build)

- Landing, login, register
- Auth session (JWT in localStorage)
- App shell (sidebar / mobile top nav)
- Groups dashboard: list, create, join by code
- Minimal group detail placeholder (no expenses yet)

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- motion/react
- Archivo (UI) + IBM Plex Mono (data)
