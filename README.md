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

## Phases

**Phase 1** — Landing, auth, app shell, groups list (create / join)

**Phase 2** — Group detail: Expenses + Members tabs, add expense (equal split), add/kick members, invite copy/rotate

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- motion/react
- Archivo (UI) + IBM Plex Mono (data)
