# Apple Account Check & Untangler

Client-side React app for a household Apple ID audit. Parents fill per-device “passports” on each phone/Mac; Andy merges them via compressed URL hashes into a conflict matrix and a 3-phase runbook.

**No backend. No database. Zero passwords stored.** Answers live in `localStorage` on the browser that typed them.

## Live (GitHub Pages)

Base path: `/apple-detangler/`

Example: `https://<user>.github.io/apple-detangler/`

## Features

- **6 pre-configured household devices** (`mum-iphone`, `mum-watch`, `mum-macbook`, `dad-imac`, `dad-ipad`, `dad-iphone`) plus **+ Add Another Device**
- Expandable inspector with plain-English questions and CSS “where to tap” mockups per platform (modern iPhone, older iPad two-column Settings, macOS System Settings / Messages)
- watchOS-specific pairing / version / pre-sign-out checks
- Auto-save on every keystroke to `localStorage`
- `#ci=` single-device passport links (lz-string) — upsert by `device.id`
- Andy’s **Master Matrix** conflict engine + **custom 3-phase runbook** (`#plan=`)
- Bold **KEEP A COPY** warnings for Contacts, Calendars, and Keychain before sign-out

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 via `@tailwindcss/vite`
- `lucide-react` icons
- `lz-string` for `#ci=` / `#plan=` compression

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Production assets are emitted under `base: '/apple-detangler/'` for GitHub Pages.

## GitHub Pages setup

1. Create a public repo named `apple-detangler` (folder name matches Pages base).
2. Push `main`.
3. **Settings → Pages → Build and deployment → GitHub Actions** (workflow in `.github/workflows/deploy-pages.yml`).
4. Or deploy `dist/` to Cloudflare Pages — `public/_redirects` provides SPA fallback (`/* /index.html 200`).

## Privacy

- Do **not** paste Apple ID passwords into this app (fields are emails / versions only).
- Shared `#ci=` / `#plan=` links contain the JSON you entered, compressed into the URL hash. Treat links like sensitive household notes.
- Clear site data in the browser to wipe local progress.
