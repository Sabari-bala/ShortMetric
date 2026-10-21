# ShortMetric

**Short links. Clear insights.**

ShortMetric is a full-stack link management and click analytics platform. Create short links with optional custom aliases, share them anywhere, and track how they perform in real time.

---

## Overview

ShortMetric solves a common problem: long URLs are hard to share, and there is no easy way to know how they perform after being shared. ShortMetric makes link management simple and gives you clear, actionable click data — all from a single dashboard.

Users can:
- Create short links with auto-generated codes or custom aliases
- Set expiration dates and toggle links on/off without deleting them
- Generate QR codes for physical sharing
- Track clicks with details on browser, device, operating system, referrer, and timestamp
- Analyze per-link performance through interactive charts

---

## Features

### Authentication & Accounts
- Token-based registration, login, and logout
- Protected routes with automatic session expiry handling
- Profile editing (username, email)
- Secure password change with current password verification

### Link Management
- Create short links from any valid URL
- Optional custom aliases with reserved-word protection
- URL format validation (scheme, domain, TLD)
- Duplicate URL prevention (one URL = one link per user)
- Edit, delete, enable/disable, and expiration control
- QR code generation with PNG download

### Redirect System
- Public short URL endpoint (`/<short_code>/`)
- Server-side validation: exists → active → not expired
- Click recording: browser, device category, OS, referrer, user agent, timestamp
- Custom user-agent parser (no external dependencies)

### Analytics Dashboard
- Overview metrics: total links, total clicks, active, expired
- Search by short code or original URL
- Status filter (All / Active / Inactive / Expired)
- Sort by newest, oldest, most clicks, least clicks
- Server-side pagination
- Per-link analytics: clicks-over-time chart, device breakdown, browser breakdown, OS breakdown, recent clicks table

### UI/UX
- Responsive design (desktop, tablet, mobile)
- Clean SaaS design system with custom Tailwind tokens
- Reusable component library
- Copy-to-clipboard with feedback
- Loading, empty, and error states
- 404 fallback and error boundary
- Reduced-motion and accessible focus support

---

## Tech Stack

### Backend
- **Python 3**
- **Django 5**
- **Django REST Framework** — RESTful API
- **DRF TokenAuthentication** — token-based auth
- **SQLite** (development) / **PostgreSQL** (production)
- **Gunicorn** + **WhiteNoise** (production serving)
- **dj-database-url** + **python-dotenv** (env-based configuration)

### Frontend
- **React 18**
- **Vite** — build tool
- **React Router v6** — routing
- **TanStack Query** — data fetching and caching
- **Axios** — HTTP client with interceptors
- **Tailwind CSS** — custom design tokens
- **Recharts** — analytics charts
- **Lucide React** — icon system
- **qrcode.react** — QR code generation

### Deployment
- **Render** — backend + PostgreSQL
- **Vercel** — frontend

---

## Architecture
Browser
│
▼
React 18 + Vite Frontend
│
▼ HTTPS / Token Auth
Django REST API
│
▼ ORM
PostgreSQL (prod) / SQLite (dev)

text

**Public redirect flow** — separate request, anonymous access:
Visitor opens https://backend-host/<short_code>
│
▼
Django redirect view
│
▼
Validate: exists → active → not expired
│
▼
Record click metadata → Redirect to original URL

text

---

## Project Structure
ShortMetric/
├── backend/
│ ├── apps/
│ │ ├── users/ # Auth, profile
│ │ ├── links/ # Link CRUD + redirect
│ │ └── analytics/ # Click tracking, analytics
│ ├── config/
│ │ ├── settings/
│ │ │ ├── base.py
│ │ │ ├── development.py
│ │ │ └── production.py
│ │ └── urls.py
│ ├── requirements/
│ │ ├── base.txt
│ │ ├── development.txt
│ │ └── production.txt
│ └── manage.py
├── web/
│ ├── src/
│ │ ├── components/ # Reusable UI
│ │ ├── pages/ # Route pages
│ │ ├── layouts/ # App shells
│ │ ├── hooks/ # Custom hooks
│ │ ├── services/ # API layer
│ │ ├── context/ # Auth context
│ │ └── lib/ # Utilities
│ ├── package.json
│ └── vite.config.js
└── README.md

text

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Git

### Clone

```bash
git clone https://github.com/Sabari-bala/ShortMetric.git
cd ShortMetric
Backend Setup
powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend\requirements\development.txt
cd backend
python manage.py migrate
python manage.py runserver
Backend available at http://127.0.0.1:8000

Frontend Setup
Open a second terminal:

powershell
cd web
npm install
npm run dev
Frontend available at http://localhost:5173

Vite proxies /api/* to Django, so no CORS configuration is needed in development.

Environment Variables
Create .env files from .env.example in both backend/ and web/.

Backend

DJANGO_SECRET_KEY — Django secret key

DJANGO_ALLOWED_HOSTS — Comma-separated hosts

DATABASE_URL — PostgreSQL connection string (production)

DJANGO_DEBUG — True in development only

Frontend

VITE_API_BASE_URL — API URL (leave empty in dev to use proxy)

VITE_SHORT_LINK_ORIGIN — Public backend origin for short URLs

Never commit .env files or production secrets.

API Endpoints
MethodEndpointPurpose
POST/api/auth/register/Register a new user
POST/api/auth/login/Login and receive token
POST/api/auth/logout/Logout and invalidate token
GET/api/auth/me/Retrieve current user profile
PATCH/api/auth/me/Update username or email
POST/api/auth/change-password/Change password
GET/api/links/List user's links (paginated, filterable, searchable, sortable)
POST/api/links/Create a new link
GET/api/links/<id>/Retrieve link details
PATCH/api/links/<id>/Update link
DELETE/api/links/<id>/Delete link
GET/api/analytics/Dashboard analytics summary
GET/api/analytics/<link_id>/Per-link analytics
GET/<short_code>/Public redirect (records click)
Query parameters supported by /api/links/:

page — page number (pagination)

search — search in short code or original URL

status — active / inactive / expired

sort — newest / oldest / clicks / least_clicks

Database Models
Link
user — ForeignKey to Django User

original_url — Original destination URL

short_code — Unique short identifier

is_active — Whether the link redirects

expires_at — Optional expiration timestamp

created_at, updated_at — Timestamps

Click
link — ForeignKey to Link

clicked_at — Timestamp

referrer — HTTP Referer header

user_agent — Raw user agent string

browser — Parsed browser name

device_category — Desktop / Mobile / Tablet

operating_system — Parsed OS name

Profile
One-to-one with Django User

Testing
Backend test suite covers authentication, authorization, link CRUD, redirect behavior, click tracking, and analytics permissions.

powershell
cd backend
python manage.py test
All tests passing. See backend/apps/*/tests.py for details.

Deployment
Backend (Render)
Build command: pip install -r requirements/production.txt && python manage.py collectstatic --no-input && python manage.py migrate

Start command: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT

Environment variables: DJANGO_SECRET_KEY, DJANGO_ALLOWED_HOSTS, DATABASE_URL

Database: Managed PostgreSQL

Frontend (Vercel)
Framework: Vite

Build command: npm run build

Output directory: dist

Environment variables: VITE_API_BASE_URL, VITE_SHORT_LINK_ORIGIN

Production uses HTTPS, DEBUG=False, and environment-driven configuration.

About
ShortMetric is an independently developed full-stack application exploring modern link management and click analytics. It is not affiliated with or sponsored by any commercial company.

All code, design, and branding are original. Third-party libraries remain subject to their respective licenses.

License
See LICENSE.
