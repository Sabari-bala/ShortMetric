# ShortMetric

**Short links. Clear insights.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://shortmetric.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://shortmetric-api.onrender.com)
[![CI Pipeline](https://github.com/Sabari-bala/ShortMetric/actions/workflows/ci.yml/badge.svg)](https://github.com/Sabari-bala/ShortMetric/actions/workflows/ci.yml)

Full-stack link management and click analytics. Create short links with aliases, expiry, QR codes, then track clicks through an interactive dashboard.

## Live Demo

- App: https://shortmetric.vercel.app
- API: https://shortmetric-api.onrender.com

**Demo account** (One-Click Login on login page)

| Username | Password |
|---|---|
| `SabariBalaMR` | `ShortMetric@2026` |

> Render free tier may cold-start 15-30s. Password change is blocked for the demo account.

## Features

- Token auth (register/login/logout), protected routes
- One-Click demo login
- CRUD links, custom aliases with reserved-word protection
- QR code generation and download
- Server-side redirect (302) with click tracking
- Analytics dashboard: metrics, activity over time, browser/device/OS breakdowns, search, filter, pagination
- Argon2 passwords, per-user isolation, locked demo password

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router 7, TanStack Query, Axios, Recharts, Lucide, Vitest + RTL

**Backend:** Python 3, Django 5, DRF (Token Auth), Argon2, Gunicorn, WhiteNoise, PostgreSQL (Neon), SQLite (dev)

**DevOps:** GitHub Actions CI, Render (backend), Vercel (frontend), Neon (database)

## Architecture

Browser -> React/Vite (Vercel) -> Django/DRF (Render) -> PostgreSQL (Neon)

Redirect flow: short URL -> validate (active, not expired) -> record click -> 302 to destination.

## Models

- User (Django built-in)
- Profile (1:1 extension)
- Link (user, original_url, short_code, is_active, expires_at)
- Click (link, clicked_at, referrer, user_agent, browser, device_category, operating_system)

## Local Dev

```bash
git clone https://github.com/Sabari-bala/ShortMetric.git
cd ShortMetric
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend\requirements\development.txt
cd backend && python manage.py migrate && python manage.py runserver
```

```bash
cd web
npm install
npm run dev
```

## Testing

- Backend (18): `cd backend && python manage.py test`
- Frontend (1): `cd web && npm run test`

## Deployment

- **Render:** `build.sh` installs deps, collects static, migrates. CI triggers deploy hook via `RENDER_DEPLOY_HOOK_URL` secret on push to main.
- **Vercel:** `vercel.json` handles SPA fallback + `/api/*` proxy + no-cache `index.html`.
- **Neon:** `DATABASE_URL` env var.
- **CI:** `workflow_dispatch` + `push` to main. Jobs: backend-test, frontend-test, deploy.

## Limitations

- DRF tokens don't expire (JWT refresh: V2)
- No rate-limit on public redirect
- Render free tier cold-starts (15-30s)