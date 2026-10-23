# ShortMetric

> Short links. Clear insights.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://shortmetric.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Django%205-092E20?style=for-the-badge&logo=django)](https://shortmetric-api.onrender.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react)](https://shortmetric.vercel.app)

ShortMetric is a full-stack link management and click analytics platform. Create short links with custom aliases and expiration dates, generate QR codes, and understand link performance through an interactive analytics dashboard.

## Live Demo

- **Application:** https://shortmetric.vercel.app
- **Backend API:** https://shortmetric-api.onrender.com

The backend is hosted on a free tier and may take 30–60 seconds to wake after inactivity.

### Demo account

| Username | Password |
| --- | --- |
| `SabariBalaMR` | `ShortMetric@2026` |

The credentials are public and intended only for demonstration. Do not store personal or sensitive information in the demo account.

## Features

### Authentication and profile
- Token-based registration, login, and logout.
- Protected frontend routes and handling for expired or invalid sessions.
- Profile editing and password changes with current-password verification.
- Backend-enforced per-user data isolation.

### Link management
- Generate short codes or choose custom alphanumeric aliases.
- Create, edit, enable, disable, and delete links.
- Set optional expiration dates.
- Generate and download QR codes as PNG files.
- Search, filter by status, sort, and paginate link lists.

### Redirects and click tracking
- Public redirect endpoint at `/<short_code>/`.
- Checks link existence, active status, and expiration before redirecting.
- Records click timestamp, browser, device category, operating system, referrer, and user-agent information.
- Lightweight user-agent parsing without an external parsing dependency.

### Analytics dashboard
- Overview of total links, clicks, active links, and expired links.
- Click activity over time and device, browser, and operating-system breakdowns.
- Recent click activity and per-link analytics.
- Interactive charts powered by Recharts.

### User experience
- Responsive desktop, tablet, and mobile layouts.
- Reusable React components and a custom Tailwind CSS design system.
- Toast notifications, copy-to-clipboard feedback, and QR-code downloads.
- Loading, empty, and error states, plus a not-found page and error boundary.

## Technology Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React 19 | Component-based user interface |
| Vite | Development server and production build |
| React Router 7 | Client-side routing |
| TanStack Query | Server-state management and data fetching |
| Axios | HTTP client |
| Tailwind CSS 3 | Responsive styling and design system |
| Recharts | Analytics charts |
| qrcode.react | QR-code generation |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
| --- | --- |
| Python 3.11 | Runtime |
| Django 5 | Web framework and application logic |
| Django REST Framework | REST API |
| DRF TokenAuthentication | API authentication |
| Django ORM | Database access |
| django-cors-headers | Cross-origin configuration |
| Gunicorn and WhiteNoise | Application serving and static files |
| dj-database-url and python-dotenv | Environment-based configuration |

### Database and hosting
- **Development:** SQLite.
- **Production configuration:** PostgreSQL through `DATABASE_URL`.
- **Backend hosting:** Render.
- **Frontend hosting:** Vercel.

## Architecture

```text
Browser
   |
   v
React + Vite (UI, routing, API requests)
   | HTTPS / REST
   v
Django REST Framework (authentication, business logic, analytics)
   | Django ORM
   v
SQLite / PostgreSQL (users, links, click events)
```

### Redirect flow

```text
Visitor opens a short URL
        |
Django resolves the short code
        |
Link exists? ---- no ----> 404
        |
Active and not expired? -- no --> unavailable response
        |
Record click metadata
        |
Redirect to the original URL
```

### Data model
- **User:** Django's built-in user model for accounts and authentication.
- **Link:** owner, original URL, unique short code, active status, optional expiration, and timestamps.
- **Click:** link, timestamp, referrer, user agent, browser, device category, and operating system.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register/` | Register a user |
| POST | `/api/auth/login/` | Log in |
| POST | `/api/auth/logout/` | Log out and revoke the token |
| GET, PATCH | `/api/auth/me/` | Retrieve or update the profile |
| POST | `/api/auth/change-password/` | Change the password |
| GET, POST | `/api/links/` | List or create links |
| GET, PATCH, DELETE | `/api/links/<id>/` | Retrieve, update, or delete a link |
| GET | `/api/analytics/` | Dashboard analytics |
| GET | `/api/analytics/<link_id>/` | Analytics for one link |
| GET | `/<short_code>/` | Redirect through a short link |

Link-list query parameters include `page`, `search`, `status`, and `sort`.

## Local Setup

### Prerequisites
- Python 3.11 (see `backend/runtime.txt`)
- Node.js and npm compatible with the installed Vite version
- Git

### 1. Clone the repository

```powershell
git clone https://github.com/Sabari-bala/ShortMetric.git
cd ShortMetric
```

### 2. Configure the backend

From the project root, create and activate a virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend\requirements\development.txt
```

Copy `.env.example` to `.env` in the project root and replace the development secret with a local secret. For local development, the settings use SQLite.

Run database migrations and start Django:

```powershell
cd backend
python manage.py migrate
python manage.py runserver
```

The API runs at `http://127.0.0.1:8000`.

### 3. Configure and run the frontend

Open a second terminal at the project root. If using a deployed API, create `web/.env.local` and set the variables below. For local development, the Vite proxy sends API requests to Django and these values can be omitted.

```dotenv
VITE_API_BASE_URL=
VITE_SHORT_LINK_ORIGIN=http://127.0.0.1:8000
```

Then run:

```powershell
cd web
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DJANGO_SECRET_KEY` | Django secret key; use a private value outside local development |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated allowed hostnames for production |
| `DATABASE_URL` | Optional database connection URL; production uses PostgreSQL |
| `DJANGO_DEBUG` | Debug configuration where supported by the active settings |
| `VITE_API_BASE_URL` | Optional API origin used by the frontend |
| `VITE_SHORT_LINK_ORIGIN` | Origin used when constructing public short links |

Never commit real secret keys, database credentials, or private environment files.

## Tests

Run the backend test suite from the backend directory:

```powershell
python manage.py test
```

The tests cover authentication, link creation and ownership, redirect behavior, click tracking, and analytics access permissions.

## Demo Data

A management command can populate the configured database with sample links and click activity:

```powershell
python manage.py seed_demo
```

Check the active database configuration before running this command. It modifies database contents.

## Deployment

### Backend — Render
- Uses the production Django settings module.
- Installs dependencies from `backend/requirements/production.txt`.
- Collects static files and applies migrations during the build.
- Uses environment variables for the secret key, allowed hosts, and database URL.
- Runs the application with Gunicorn and serves static files through WhiteNoise.

### Frontend — Vercel
- Framework preset: Vite.
- Project root: `web/`.
- Build command: `npm run build`.
- Output directory: `dist`.
- Configure `VITE_API_BASE_URL` and `VITE_SHORT_LINK_ORIGIN` in the Vercel project settings when required.

## Engineering Notes

- Fixed a duplicated API path issue (`/api/api/`) by aligning the frontend API base URL with endpoint paths.
- Resolved a Vercel build issue caused by UTF-8 byte-order marks in files edited through Windows PowerShell.
- Configured CORS for communication between the Vercel frontend and Render API.
- Kept redirect validation and click recording on the backend rather than relying on client-side tracking.

## Known Limitations

- The free backend hosting tier may sleep after inactivity, making the first request slow.
- DRF's built-in token authentication does not expire tokens automatically; logout revokes the current token.
- Click totals do not currently exclude bots or link-preview crawlers.
- The public redirect endpoint does not currently have dedicated rate limiting.

These limitations are documented intentionally and are candidates for future hardening.

## Project Structure

```text
ShortMetric/
├── backend/
│   ├── apps/
│   │   ├── users/       # Authentication and profiles
│   │   ├── links/       # Link management and redirects
│   │   └── analytics/   # Click tracking and analytics
│   ├── config/settings/
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
├── .env.example
├── LICENSE
├── runtime.txt
└── README.md
```

## License

MIT License. See [LICENSE](LICENSE) for details.

---

**Author:** Sabari Bala M R, Python Full Stack Developer | [LinkedIn](https://linkedin.com/in/sabari-bala) | [GitHub](https://github.com/Sabari-bala)
