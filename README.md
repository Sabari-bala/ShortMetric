# ShortMetric

**Short links. Clear insights.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://shortmetric.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://shortmetric-api.onrender.com)
[![CI Pipeline](https://github.com/Sabari-bala/ShortMetric/actions/workflows/ci.yml/badge.svg)](https://github.com/Sabari-bala/ShortMetric/actions/workflows/ci.yml)

ShortMetric is a full-stack link management and click analytics platform. Users create short links with custom aliases, expiration dates, and QR codes, then see how each link performs through an interactive dashboard.

## 🔗 Live Demo

- **Application:** https://shortmetric.vercel.app
- **Backend API:** https://shortmetric-api.onrender.com

**Demo account (One-Click Login available on the login page)**

| Username | Password |
|---|---|
| `SabariBalaMR` | `ShortMetric@2026` |

> **Note:** The backend runs on Render's free tier and may take 15–30 seconds to wake up after inactivity. The demo credentials are public, and the backend explicitly blocks password changes for the demo account to ensure it never breaks.

## ✨ Features

- **Authentication:** Token-based registration, login, and logout. Protected frontend routes.
- **One-Click Demo:** A dedicated button on the login page to instantly access the demo account.
- **Link Management:** Create, edit, enable/disable, and delete links. Custom aliases with reserved-word protection.
- **QR Codes:** Generate and download dynamic QR codes as PNG files.
- **Public Redirects:** Anonymous visitors are validated server-side, tracked, and redirected via a 302 response.
- **Analytics Dashboard:** Overview metrics, click activity over time, browser/device/OS breakdowns (using Recharts), search, filtering, and pagination.
- **Security:** Argon2 password hashing, strict per-user data isolation, and disabled password changes for demo users.

## 🛠️ Tech Stack

### Frontend
- **React 19 & Vite:** Fast SPA with route-based code splitting (`React.lazy`/`Suspense`).
- **Tailwind CSS:** Custom design system (Teal/Emerald palette).
- **React Router 7:** Client-side routing.
- **TanStack Query & Axios:** Server-state management and API requests.
- **Recharts & Lucide React:** Interactive charts and icons.
- **Vitest & React Testing Library:** Frontend component testing.

### Backend
- **Python 3 & Django 5:** Core web framework.
- **Django REST Framework (DRF):** REST API and Token Authentication.
- **Argon2:** Secure password hashing.
- **Gunicorn & WhiteNoise:** Production server and static file serving.
- **PostgreSQL (Neon.tech):** Permanent production database.
- **SQLite:** Local development database.

### DevOps & CI/CD
- **GitHub Actions:** CI pipeline running backend tests, frontend tests, and builds.
- **Render:** Backend hosting and automated deployment via deploy hooks.
- **Vercel:** Frontend hosting, SPA routing (`vercel.json`), and API proxying.

## 🏗️ Architecture

```text
Browser
   │
   ▼
React 19 + Vite (Vercel)
   │  HTTPS / REST (Proxy via vercel.json)
   ▼
Django REST Framework (Render)
   │  Django ORM
   ▼
PostgreSQL (Neon.tech)
Public Redirect Flow
text
Visitor opens short URL -> Django redirect endpoint -> Validate (exists, active, not expired) -> Record click metadata -> Redirect to destination.
🗄️ Database Models
User: Django's built-in user model.

Profile: One-to-one extension for user info.

Link: user, original_url, short_code, is_active, expires_at.

Click: link, clicked_at, referrer, user_agent, browser, device_category, operating_system.

🚀 Getting Started (Local Development)
1. Clone the repository

bash
git clone https://github.com/Sabari-bala/ShortMetric.git
cd ShortMetric
2. Backend Setup

powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend\requirements\development.txt
cd backend
python manage.py migrate
python manage.py runserver
3. Frontend Setup

powershell
cd web
npm install
npm run dev
🧪 Testing
Backend: 18 tests covering authentication, authorization, CRUD, redirects, and analytics.

powershell
cd backend
python manage.py test
Frontend: 1 test covering component rendering.

powershell
cd web
npm run test
☁️ Deployment Configuration
Render: Uses build.sh to install dependencies, collect static files, and run migrations. CI triggers a deploy hook after tests pass.

Vercel: Uses vercel.json for SPA fallback routing, API proxying to avoid CORS, and no-cache headers for index.html to ensure users always get the latest version.

Neon: Database connection is handled via the DATABASE_URL environment variable.

⚠️ Known Limitations
DRF tokens do not automatically expire (JWT with refresh tokens is recommended for V2).

The public redirect endpoint lacks rate limiting (vulnerable to bot traffic).

Render's free tier causes a 15–30 second cold start.
