# ShortMetric

**Short links. Clear insights.**

## 🌐 Live Demo

- **Frontend:** https://shortmetric.vercel.app
- **Backend API:** https://shortmetric-api.onrender.com
- **Demo credentials:** `SabariBalaMR` / `ShortMetric@2026`

> Free tier note: The backend may take 30–60 seconds to wake up on first request.

ShortMetric is a full-stack link management and click analytics platform. Create short links with optional custom aliases, share them anywhere, and track how they perform in real time.

## Overview

Long URLs are hard to share, and there's no easy way to know how they perform after being shared. ShortMetric makes link management simple and gives clear, actionable click data from one dashboard.

Users can:

- Create short links with auto-generated codes or custom aliases
- Set expiration dates and toggle links on/off without deleting them
- Generate QR codes for physical sharing
- Track clicks with details on browser, device, operating system, referrer, and timestamp
- Analyze per-link performance through interactive charts

## Features

### Authentication
- Token-based registration, login, and logout
- Protected routes with automatic session expiry handling
- Profile editing (username, email)
- Secure password change with current password verification

### Link Management
- Create short links from any valid URL
- Optional custom aliases with reserved-word protection
- URL format validation (scheme, domain, TLD)
- Duplicate URL prevention
- Edit, delete, enable/disable, expiration control
- QR code generation with PNG download

### Redirect System
- Public short URL endpoint
- Server-side validation: exists → active → not expired
- Click recording: browser, device, OS, referrer, user agent, timestamp
- Custom user-agent parser with no external dependencies

### Analytics Dashboard
- Overview metrics: total links, total clicks, active, expired
- Search by short code or original URL
- Status filter (All / Active / Inactive / Expired)
- Sort by newest, oldest, most clicks, least clicks
- Server-side pagination
- Per-link charts: clicks over time, devices, browsers, OS, recent clicks

### UI/UX
- Responsive across desktop, tablet, and mobile
- Custom Tailwind design system
- Reusable component library
- Copy-to-clipboard with feedback
- Loading, empty, and error states
- 404 fallback and error boundary

## Tech Stack

### Backend
- Python 3
- Django 5
- Django REST Framework
- DRF TokenAuthentication
- SQLite (development) / PostgreSQL (production)
- Gunicorn + WhiteNoise
- dj-database-url + python-dotenv

### Frontend
- React 18
- Vite
- React Router v6
- TanStack Query
- Axios
- Tailwind CSS
- Recharts
- Lucide React
- qrcode.react

### Deployment
- Render (backend + PostgreSQL)
- Vercel (frontend)

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

### Public Redirect Flow
Visitor opens short URL
│
▼
Django redirect view
│
▼
Validate: exists → active → not expired
│
▼
Record click → Redirect to original URL

text

## Project Structure
ShortMetric/
├── backend/
│ ├── apps/
│ │ ├── users/ # Auth, profile
│ │ ├── links/ # Link CRUD + redirect
│ │ └── analytics/ # Click tracking
│ ├── config/
│ │ └── settings/
│ ├── requirements/
│ └── manage.py
├── web/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── layouts/
│ │ ├── hooks/
│ │ ├── services/
│ │ └── context/
│ ├── package.json
│ └── vite.config.js
└── README.md

text

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
Backend: http://127.0.0.1:8000

Frontend Setup
Open a second terminal:

powershell
cd web
npm install
npm run dev
Frontend: http://localhost:5173

Vite proxies /api/* to Django during development — no CORS setup needed locally.

Environment Variables
Create .env files from .env.example in both backend/ and web/.

Backend:

DJANGO_SECRET_KEY

DJANGO_ALLOWED_HOSTS

DATABASE_URL

DJANGO_DEBUG

Frontend:

VITE_API_BASE_URL

VITE_SHORT_LINK_ORIGIN

Never commit .env files or production secrets.

API Endpoints
Method	Endpoint	Purpose
POST	/api/auth/register/	Register
POST	/api/auth/login/	Login
POST	/api/auth/logout/	Logout
GET	/api/auth/me/	Get profile
PATCH	/api/auth/me/	Update profile
POST	/api/auth/change-password/	Change password
GET	/api/links/	List links (paginated)
POST	/api/links/	Create link
GET	/api/links/<id>/	Get link
PATCH	/api/links/<id>/	Update link
DELETE	/api/links/<id>/	Delete link
GET	/api/analytics/	Dashboard analytics
GET	/api/analytics/<link_id>/	Per-link analytics
GET	/<short_code>/	Public redirect
Query parameters for /api/links/:

page — pagination

search — search in code or URL

status — active / inactive / expired

sort — newest / oldest / clicks / least_clicks

Database Models
Link
user (FK to Django User)

original_url

short_code (unique)

is_active

expires_at

created_at, updated_at

Click
link (FK)

clicked_at

referrer

user_agent

browser

device_category

operating_system

Profile
One-to-one with Django User

Testing
powershell
cd backend
python manage.py test
All backend tests passing — covering authentication, authorization, link CRUD, redirect behavior, click tracking, and analytics permissions.

Deployment
Backend (Render)
Build: pip install -r requirements/production.txt && python manage.py collectstatic --no-input && python manage.py migrate

Start: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT

Environment: DJANGO_SECRET_KEY, DJANGO_ALLOWED_HOSTS, DATABASE_URL

Database: Managed PostgreSQL

Frontend (Vercel)
Framework: Vite

Build: npm run build

Output: dist

Environment: VITE_API_BASE_URL, VITE_SHORT_LINK_ORIGIN

About
ShortMetric is an independently developed full-stack application exploring modern link management and click analytics. All code, design, and branding are original. Third-party libraries remain subject to their respective licenses.

License
See LICENSE.

