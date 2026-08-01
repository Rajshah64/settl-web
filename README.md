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

**Phase 2** — Group detail: Expenses + Members + Balances tabs, equal-split create, invite copy/rotate

**Phase 2b** — Derived group balances + suggested settle-up (`GET /groups/:id/balances`)

**Phase 3** — Record settlements + mark-as-paid; UPI pay links when payee has VPA

**Account / expenses** — Profile (name, UPI ID, password); expense edit/delete

**Groups** — Edit / archive / restore / transfer; short join links `/j/[code]` + QR

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- motion/react
- Archivo (UI) + IBM Plex Mono (data)
