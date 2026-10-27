# ShortMetric

**Short links. Clear insights.**

ShortMetric is a full-stack URL shortening and click analytics platform built with Django REST Framework and React. It enables users to create and manage short URLs, customize aliases, generate QR codes, and understand link performance through an analytics dashboard.

<p align="left">
  <a href="https://shortmetric.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-Open%20App-6C4CE0?style=for-the-badge&logo=vercel&logoColor=white" alt="Live demo"></a>
  <a href="https://github.com/Sabari-bala/ShortMetric/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Sabari-bala/ShortMetric/ci.yml?branch=main&label=CI&logo=githubactions&style=for-the-badge" alt="CI status"></a>
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
  <img src="https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white" alt="React">
</p>

**Live application:** https://shortmetric.vercel.app  
**Backend API:** https://shortmetric-api.onrender.com  
**Source code:** https://github.com/Sabari-bala/ShortMetric

## Demo access

You can explore the deployed application using the dedicated public demo account.

| Field | Value |
|---|---|
| Application | [ShortMetric Live Demo](https://shortmetric.vercel.app) |
| Username | `SabariBalaMR` |
| Password | `ShortMetric@2026` |

**Please note:**
- The backend runs on Render's free tier and may need approximately 15–30 seconds to wake up after inactivity.
- This is a shared demonstration account. Its data may be modified or reset.
- Do not enter personal, confidential, or sensitive information.

## Features

### Link management
- Create short URLs from longer destination links.
- Customize short-link aliases.
- Edit destination URLs and manage existing links.
- Set expiration dates for links.
- Enable or disable links.
- Search, filter, sort, and paginate link collections.

### Click analytics
- Track clicks on short links.
- Record available click timestamps and referrer information.
- Capture user-agent information for browser, device, and operating-system breakdowns.
- View dashboard metrics and activity over time.
- Explore analytics for individual links.

### QR codes
- Generate QR codes for short URLs.
- Download QR codes as PNG images.

### Authentication and access control
- Register and authenticate user accounts.
- Update profile details and change passwords.
- Revoke the current authentication token on logout.
- Restrict link management and analytics queries to the authenticated user's resources.

### User experience
- Responsive layouts for desktop, tablet, and mobile.
- Loading, empty, error, and not-found states.
- Client-side route navigation and lazy-loaded page components.

## Technology stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite 8, JavaScript |
| Styling | Tailwind CSS 3 |
| Routing | React Router 7 |
| Server-state management | TanStack Query |
| HTTP communication | Axios |
| Analytics visualization | Recharts |
| Icons | Lucide React |
| QR code generation | qrcode.react |
| Backend | Python 3.11, Django 5, Django REST Framework |
| Authentication | DRF TokenAuthentication |
| Data access | Django ORM |
| Production database | Neon PostgreSQL |
| Development database | SQLite |
| Frontend deployment | Vercel |
| Backend deployment | Render |
| Automated checks | GitHub Actions |

## Architecture

```text
                    User / Browser
                          |
                          v
                React + Vite Frontend
                 |                  |
                 |                  v
                 |             React Router
                 |
                 | HTTPS / REST API
                 v
             Django REST Framework
                 |
       +---------+----------+
       |         |          |
       v         v          v
    Users      Links     Analytics
       |         |          |
       +---------+----------+
                 |
                 v
             Django ORM
                 |
                 v
          Database Layer
          /             \
 SQLite (development)  PostgreSQL (production)
```

The frontend communicates with the backend through REST endpoints. Django handles authentication, link management, redirect validation, click tracking, and analytics access.

## How short-link redirection works

1. A visitor opens a ShortMetric URL.
2. The backend looks up the corresponding short code.
3. The application checks whether the link exists, is enabled, and has not expired.
4. Available click metadata is recorded.
5. The visitor is redirected to the destination URL.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register/` | Register an account |
| `POST` | `/api/auth/login/` | Authenticate a user |
| `POST` | `/api/auth/logout/` | Revoke the current token |
| `GET`, `PATCH` | `/api/auth/me/` | Retrieve or update the profile |
| `POST` | `/api/auth/change-password/` | Change the account password |
| `GET`, `POST` | `/api/links/` | List or create links |
| `GET`, `PATCH`, `DELETE` | `/api/links/<id>/` | Retrieve, update, or delete a link |
| `GET` | `/api/analytics/` | Retrieve dashboard analytics |
| `GET` | `/api/analytics/<link_id>/` | Retrieve analytics for an individual link |
| `GET` | `/<short_code>/` | Redirect through a short link |

The link-list endpoint supports pagination and query parameters for search, filtering, and sorting. Refer to the source code for the current request and response schemas.

## Getting started locally

### Prerequisites

Install the following tools before starting:

- Python 3.11
- Node.js and npm
- Git
- Visual Studio Code (recommended)

### 1. Clone the repository

```bash
git clone https://github.com/Sabari-bala/ShortMetric.git
cd ShortMetric
```

### 2. Create and activate a Python virtual environment

**Windows PowerShell**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution, use an appropriate execution-policy setting for your environment or activate the environment from Command Prompt instead.

**macOS / Linux**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install backend dependencies

From the repository root:

```bash
python -m pip install -r backend/requirements/development.txt
```

On Windows PowerShell, the equivalent path is:

```powershell
python -m pip install -r backend\requirements\development.txt
```

### 4. Configure environment variables

Use `.env.example` as a reference and create the required local environment configuration. Supply the values appropriate for your local setup.

Common configuration variables include:

| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | Django application secret |
| `DJANGO_ALLOWED_HOSTS` | Permitted backend hostnames |
| `DJANGO_DEBUG` | Development debug setting |
| `DATABASE_URL` | Database connection string when using database URL configuration |
| `VITE_API_BASE_URL` | Frontend API base URL |
| `VITE_SHORT_LINK_ORIGIN` | Origin used to construct short URLs |

The exact requirements depend on the active Django settings module. Never commit real secrets, database credentials, or private environment files.

### 5. Run database migrations and start Django

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

The local backend is available at:

http://127.0.0.1:8000

### 6. Install frontend dependencies and start Vite

Open a second terminal at the repository root:

```bash
cd web
npm ci
npm run dev
```

The frontend is available at:

http://localhost:5173

During local development, Vite is configured to proxy API requests to the local Django server.

## Testing and quality checks

Run backend checks and tests from the backend directory:

```bash
python manage.py check
python manage.py test
```

Create a production frontend build from the `web` directory:

```bash
npm ci
npm run build
```

The GitHub Actions workflow runs the configured Django checks and backend test suite, along with a frontend production build, for the relevant pushes and pull requests targeting `main`.

**CI workflow:** [View GitHub Actions](https://github.com/Sabari-bala/ShortMetric/actions/workflows/ci.yml)

## Deployment

### Frontend — Vercel
The React application is built with Vite. Configure the frontend project to use `web/` as its root directory and `dist` as the build output directory. Set the required frontend environment variables in the deployment settings.

### Backend — Render
The Django application is deployed using a production server configuration with Gunicorn and WhiteNoise. Configure the required environment variables and production settings in the hosting dashboard.

### Database — Neon PostgreSQL
The deployed backend uses PostgreSQL. Configure the production connection through `DATABASE_URL`. SQLite is intended for local development.

Deployment settings should be reviewed whenever the frontend URL, backend URL, database configuration, or environment variables change.

## Engineering decisions

- **Separated frontend and backend:** The React SPA and Django REST API have distinct responsibilities and communicate through HTTP endpoints.
- **User-scoped data access:** Authenticated link and analytics operations are restricted by ownership.
- **Database portability:** Django's ORM supports local SQLite development and a PostgreSQL production database.
- **Lazy-loaded routes:** Page-level code splitting helps reduce the JavaScript required for initial route loading.
- **Automated checks:** CI verifies the configured backend checks and frontend production build.
- **Deployment troubleshooting:** The project includes fixes for SPA deep-link routing and deployment configuration issues encountered during development.

## Known limitations and security considerations

- **Cold starts:** The free backend hosting tier may spin down after inactivity.
- **Token expiration:** DRF authentication tokens do not automatically expire; they must be revoked.
- **Browser token storage:** The frontend stores authentication tokens in `localStorage`. An XSS vulnerability could expose a stored token.
- **Analytics accuracy:** Bot traffic and link-preview crawlers are not currently filtered from click analytics.
- **Redirect rate limiting:** The public short-link redirect endpoint does not currently have dedicated rate limiting.

These limitations are documented so users and reviewers can understand the current implementation and its potential improvements.

## Project structure

```text
ShortMetric/
├── backend/
│   ├── apps/
│   │   ├── users/          # Authentication and profiles
│   │   ├── links/          # Link management and redirects
│   │   └── analytics/      # Click tracking and analytics
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
├── runtime.txt
├── LICENSE
└── README.md
```

## Future improvements

Potential next steps include:

- Add dedicated rate limiting for public redirects.
- Improve bot and link-preview traffic detection.
- Revisit authentication-token storage and session security.
- Add richer analytics filters and date-range comparisons.
- Expand monitoring and production error reporting.

## License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Built by Sabari Bala M R**

[GitHub](https://github.com/Sabari-bala) · [LinkedIn](https://linkedin.com/in/sabari-bala)

### Additional Engineering Notes
- **Windows BOM Encoding Failure:** Diagnosed and resolved a CI build failure caused by Windows PowerShell injecting invisible Byte Order Marks (BOM) into JSON and JSX files during file creation. This was fixed by writing a Python/PowerShell script to strip the BOM at the byte level, ensuring Vercel and GitHub Actions could parse the files correctly.
- **CI Environment Fix:** Fixed GitHub Actions failures by pinning Node 22 (to resolve `undici` worker crashes during Vitest execution) and explicitly defining the Python cache dependency path to prevent missing package errors.
