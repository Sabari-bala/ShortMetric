# ShortMetric

> Short links. Clear insights.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://shortmetric.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Django%205-092E20?style=for-the-badge&logo=django)](https://shortmetric-api.onrender.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)](https://shortmetric.vercel.app)

<!-- Add screenshots here: analytics dashboard, link list, QR code dialog -->

ShortMetric is a full-stack link management and click analytics platform. Users create short links with custom aliases, expiration dates and QR codes, then see how each link performs through an interactive dashboard.

## Live Demo

- **Application:** https://shortmetric.vercel.app
- **Backend API:** https://shortmetric-api.onrender.com

**Demo account**

| Username | Password |
|---|---|
| `SabariBalaMR` | `ShortMetric@2026` |

> **Cold start:** The backend runs on a free hosting tier and may take 30-60 seconds to wake up after inactivity. The demo credentials are public, so the account contains demonstration data only.

## What You Can Do

- Create short links with generated codes or custom aliases.
- Edit, enable, disable and delete links.
- Set link expiration dates.
- Generate and download QR codes as PNG files.
- Track clicks and inspect browser, device, operating system and referrer data.
- View interactive analytics for the whole account and for individual links.
- Search, filter, sort and paginate links.

## Features

### Authentication and profile

- Token-based registration, login and logout.
- Protected frontend routes and session-expiry handling.
- Profile editing (username and email) and password change with current-password verification.
- Per-user data isolation enforced by the backend.

### Link management

- Create short links from valid URLs with six-character generated codes.
- Custom aliases with validation and reserved-word protection.
- Duplicate original URLs are prevented for the same user.
- Enable or disable links without deleting them; confirm before deleting.
- Optional expiration dates.
- QR code generation with PNG download.

### Public redirect system

- Public endpoint at `/<short_code>/`.
- Server-side checks for link existence, active status and expiration.
- The click is recorded before the redirect, capturing timestamp, browser, device category, operating system, referrer and user agent.
- Custom user-agent parser with no external parsing dependency.

### Analytics dashboard

- Overview metrics: total links, total clicks, active links and expired links.
- Click activity over time, with device, browser and operating-system breakdowns.
- Recent click activity for each link.
- Search by short code or original URL; filter by active, inactive or expired; sort by newest, oldest, most clicks or fewest clicks; server-side pagination.

### User experience

- Responsive layouts for desktop, tablet and mobile.
- Custom Tailwind CSS design system and reusable React components.
- Toast notifications and copy-to-clipboard feedback.
- Loading, empty and error states, a 404 page and an error boundary.

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | Component-based UI |
| Vite | Dev server and production build |
| React Router v6 | Client-side routing |
| TanStack Query | Server-state management and data fetching |
| Axios | HTTP client |
| Tailwind CSS | Responsive styling and design system |
| Recharts | Analytics charts |
| qrcode.react | QR code generation |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|---|---|
| Python, Django 5 | Web framework and application logic |
| Django REST Framework | REST API |
| DRF TokenAuthentication | API authentication |
| Django ORM | Data access |
| django-cors-headers | Cross-origin configuration |
| Gunicorn, WhiteNoise | Production server and static files |
| dj-database-url, python-dotenv | Environment-based configuration |

### Database and hosting

- **PostgreSQL** in production (managed on Render), **SQLite** for local development.
- **Render** hosts the backend; **Vercel** hosts the frontend.

## Architecture

```text
Browser
   |
   v
React 18 + Vite  (UI, routing, API requests)
   |  HTTPS / REST
   v
Django REST Framework  (auth, business logic, analytics)
   |  Django ORM
   v
PostgreSQL / SQLite  (users, links, click events)
```

### Public redirect flow

```text
Visitor opens a short URL
        |
Django redirect endpoint
        |
Link exists?  -> no -> 404
        |
Active and not expired?  -> no -> unavailable response
        |
Record click metadata
        |
Redirect to the original URL
```

### Database design

- **User:** Django's built-in user model for accounts and authentication.
- **Profile:** one-to-one extension of the user for profile information.
- **Link:** `user` (owner), `original_url`, `short_code` (unique), `is_active`, `expires_at`, `created_at`, `updated_at`.
- **Click:** `link`, `clicked_at`, `referrer`, `user_agent`, `browser`, `device_category`, `operating_system`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register/` | Register a user |
| POST | `/api/auth/login/` | Log in |
| POST | `/api/auth/logout/` | Log out |
| GET, PATCH | `/api/auth/me/` | Retrieve or update the profile |
| POST | `/api/auth/change-password/` | Change the password |
| GET, POST | `/api/links/` | List or create links |
| GET, PATCH, DELETE | `/api/links/<id>/` | Retrieve, update or delete a link |
| GET | `/api/analytics/` | Dashboard analytics |
| GET | `/api/analytics/<link_id>/` | Per-link analytics |
| GET | `/<short_code>/` | Redirect through a short link |

Link list query parameters: `page`, `search`, `status`, `sort`.

## Local Setup

### Prerequisites

- Python 3.10 or later (see `runtime.txt` for the deployed version)
- Node.js 18 or later and npm
- Git

### 1. Clone

```bash
git clone https://github.com/Sabari-bala/ShortMetric.git
cd ShortMetric
```

### 2. Backend

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend\requirements\development.txt
cd backend
python manage.py migrate
python manage.py runserver
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements/development.txt
cd backend
python manage.py migrate
python manage.py runserver
```

The backend runs at `http://127.0.0.1:8000`.

### 3. Frontend

In a second terminal from the project root:

```bash
cd web
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`. In development, Vite proxies API requests to Django.

### 4. Environment variables

Copy `.env.example` to `.env` and fill in the values.

| Where | Variables |
|---|---|
| Backend | `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `DATABASE_URL`, `DJANGO_DEBUG` |
| Frontend | `VITE_API_BASE_URL`, `VITE_SHORT_LINK_ORIGIN` |

Never commit real secret keys or database credentials.

## Testing

```bash
cd backend
python manage.py test
```

Tests cover authentication, authorization, link CRUD, redirect behavior, click tracking and analytics permissions.

<!-- After CI is added: put the test count and a CI badge here. -->

## Demo Data

A management command fills the database with sample links and click activity:

```bash
cd backend
python manage.py seed_demo
```

It modifies database contents, so check which database is configured before running it.

## Deployment

**Backend (Render).** A Django web service with a managed PostgreSQL database. The build installs production dependencies, collects static files and runs migrations; Gunicorn serves the app and WhiteNoise serves static files. Secrets, allowed hosts and the database URL come from environment variables.

**Frontend (Vercel).** Framework preset Vite, project root `web/`, build command `npm run build`, output directory `dist`. `VITE_API_BASE_URL` and `VITE_SHORT_LINK_ORIGIN` are set in the Vercel project settings.

## Engineering Notes

- **Static files on Render:** The build failed on `STATIC_ROOT` because production settings were not active during the build. Fixed by making sure the production settings module is used at build time.
- **Duplicated API path:** Requests were going to `/api/api/...` because the base URL and the endpoint paths both included `/api`. Fixed by correcting the frontend API base URL.
- **Invisible BOM characters:** Windows PowerShell added UTF-8 byte-order marks to frontend files, which broke the Vercel build. Diagnosed and removed them.
- **CORS:** Configured cross-origin handling between the Vercel frontend and the Render API.
- **Fast redirect path:** The redirect endpoint validates the link and records the click in a single write before redirecting.

## Known Limitations

- The backend runs on a free tier and sleeps after inactivity, so the first request can be slow.
- DRF's built-in token authentication issues tokens that do not expire.
- Click counts do not filter out bots or link-preview crawlers.
- No rate limiting on the public redirect endpoint.

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