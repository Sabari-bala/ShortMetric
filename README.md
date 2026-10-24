# ShortMetric

> **Short links. Clear insights.**  
> A full-stack link management and click analytics platform built with Django REST Framework and React.

<p align="left">
  <a href="https://shortmetric.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-Open%20App-6C4CE0?style=for-the-badge&logo=vercel&logoColor=white" alt="Live demo"></a>
  <a href="https://github.com/Sabari-bala/ShortMetric/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Sabari-bala/ShortMetric/ci.yml?branch=main&label=CI&logo=githubactions&style=for-the-badge" alt="CI status"></a>
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.11">
  <img src="https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django 5">
  <img src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white" alt="React 19">
</p>

**Live application:** [shortmetric.vercel.app](https://shortmetric.vercel.app)  
**Backend service:** [shortmetric-api.onrender.com](https://shortmetric-api.onrender.com)

ShortMetric lets users create and manage short URLs, customize aliases, generate QR codes, and understand link performance through click analytics. The project includes a React single-page application, a Django REST API, user-scoped data access, automated backend tests, and a CI workflow for backend checks and frontend builds.

> **Demo note:** The backend is hosted on a free service and may take a little time to wake up after inactivity. Use a dedicated demo account only; do not enter personal or sensitive information.

## Features

- **Link management:** Create short URLs, choose custom aliases, edit links, set expiry dates, and enable or disable links.
- **QR codes:** Generate QR codes for short links and download them as PNG files.
- **Click analytics:** Record click timestamps, referrers, user-agent details, browser, device category, and operating system.
- **Dashboard:** Review link and click totals, activity over time, and device/browser/OS breakdowns.
- **Link discovery:** Search, filter, sort, and paginate links.
- **Account management:** Register, log in, log out, update profile details, and change passwords.
- **Access control:** Protect authenticated API operations and scope link queries to the signed-in user.
- **Responsive UI:** Layouts for desktop, tablet, and mobile, with loading, empty, error, and not-found states.

## Tech stack

| Area | Technologies |
|---|---|
| Frontend | React 19, Vite 8, React Router 7, TanStack Query, Axios |
| UI and visualization | Tailwind CSS 3, Recharts, Lucide React |
| QR codes | qrcode.react |
| Backend | Python 3.11, Django 5, Django REST Framework |
| Authentication | DRF TokenAuthentication |
| Data access | Django ORM |
| Database | Neon PostgreSQL in production; SQLite for local development |
| Deployment | Vercel (frontend), Render (backend) |
| CI | GitHub Actions — Django checks/tests and Vite production build |

## Architecture

```text
Browser
  │
  ▼
React + Vite single-page application
  │ HTTPS / REST API
  ▼
Django REST Framework
  ├── Authentication and user-scoped permissions
  ├── Link management and redirect validation
  └── Click tracking and analytics
  │ Django ORM
  ▼
Neon PostgreSQL (production) / SQLite (local development)
```

### Short-link request flow

1. A visitor opens a short URL.
2. The backend looks up the short code and checks whether the link is active and unexpired.
3. The backend records available click metadata.
4. The visitor is redirected to the original destination.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register/` | Create an account |
| `POST` | `/api/auth/login/` | Authenticate |
| `POST` | `/api/auth/logout/` | Revoke the current token |
| `GET`, `PATCH` | `/api/auth/me/` | View or update profile |
| `POST` | `/api/auth/change-password/` | Change password |
| `GET`, `POST` | `/api/links/` | List or create links |
| `GET`, `PATCH`, `DELETE` | `/api/links/<id>/` | Retrieve, update, or delete a link |
| `GET` | `/api/analytics/` | Dashboard analytics |
| `GET` | `/api/analytics/<link_id>/` | Analytics for one link |
| `GET` | `/<short_code>/` | Redirect through a short link |

The link-list endpoint supports pagination and query parameters for search, status filtering, and sorting.

## Run locally

### Prerequisites

- Python 3.11
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Sabari-bala/ShortMetric.git
cd ShortMetric
```

### 2. Configure and start the backend

From the repository root, create and activate a virtual environment.

**Windows PowerShell**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend\requirements\development.txt
cd backend
python manage.py migrate
python manage.py runserver
```

**macOS / Linux**
```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install -r backend/requirements/development.txt
cd backend
python manage.py migrate
python manage.py runserver
```

The backend runs at `http://127.0.0.1:8000`.

### 3. Configure and start the frontend

Open a second terminal at the repository root:

```bash
cd web
npm ci
npm run dev
```

The frontend runs at `http://localhost:5173`. Vite proxies API requests to the local Django server during development.

### 4. Environment variables

Use `.env.example` as a reference and create a local `.env` file with the required values.

| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | Django secret key |
| `DJANGO_ALLOWED_HOSTS` | Allowed backend hostnames |
| `DJANGO_DEBUG` | Debug mode setting |
| `DATABASE_URL` | Database connection URL when using production settings |
| `VITE_API_BASE_URL` | Frontend API base URL |
| `VITE_SHORT_LINK_ORIGIN` | Origin used to construct short links |

Never commit real secret keys, database URLs, or other credentials.

## Testing and CI

Run the backend checks and tests locally:

```bash
cd backend
python manage.py check
python manage.py test
```

Build the frontend:

```bash
cd web
npm ci
npm run build
```

GitHub Actions runs the Django system check and backend test suite, and installs frontend dependencies from the lockfile before creating a production build on pushes and pull requests targeting `main`.

[View CI runs](https://github.com/Sabari-bala/ShortMetric/actions/workflows/ci.yml).

## Deployment

- **Frontend — Vercel:** Vite project with `web/` as the project root and `dist` as the build output. SPA rewrite rules support direct navigation and refresh on frontend routes.
- **Backend — Render:** Django production settings, Gunicorn, and WhiteNoise. Production configuration is supplied through environment variables.
- **Database — Neon PostgreSQL:** Configure the production database using `DATABASE_URL`. SQLite is used for local development.

## Engineering decisions

- **User-scoped data access:** Link querysets are filtered to the authenticated user to keep link management and analytics access scoped by ownership.
- **Separated frontend and backend:** A React SPA communicates with Django through REST endpoints.
- **Lazy-loaded frontend routes:** Page-level code splitting helps keep route-specific dependencies out of the initial JavaScript bundle.
- **Automated regression checks:** Backend tests exercise authentication, link operations, redirect rules, click tracking, and analytics permissions.
- **Deployment troubleshooting:** Resolved SPA deep-link routing and configuration issues encountered during deployment, including a UTF-8 BOM in the Vercel rewrite configuration.

## Known limitations

- The free backend hosting tier can spin down after inactivity, delaying the first request.
- DRF token authentication tokens do not expire automatically; they must be revoked.
- The frontend stores the authentication token in browser `localStorage`. A successful cross-site scripting (XSS) attack could expose it, so avoid using sensitive accounts or data.
- Click analytics do not currently filter bot traffic or link-preview crawlers.
- The public short-link redirect endpoint does not have dedicated rate limiting.

## Project structure

```text
ShortMetric/
├── backend/
│   ├── apps/
│   │   ├── users/       # Authentication and profiles
│   │   ├── links/       # Link management and redirects
│   │   └── analytics/   # Click tracking and analytics
│   ├── config/
│   │   └── settings/
│   ├── requirements/
│   └── manage.py
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── context/
│   ├── package.json
│   └── vite.config.js
├── .github/
│   └── workflows/
│       └── ci.yml
├── .env.example
├── LICENSE
├── runtime.txt
└── README.md
```

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Built by Sabari Bala M R** · [GitHub](https://github.com/Sabari-bala) · [LinkedIn](https://linkedin.com/in/sabari-bala)
