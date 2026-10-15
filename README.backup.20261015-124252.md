# ShortMetric

**Short links. Clear insights.**

ShortMetric is a full-stack link management and click analytics platform. Create short links, optionally add custom aliases, set expiration dates, share them anywhere, and track clicks with detailed analytics.

## Features

- User registration, login, and logout
- Token authentication
- Create short links with optional custom aliases
- Edit, enable/disable, and delete links
- Automatic short-code generation
- Link expiration
- Public short URL redirects with click tracking
- Click analytics: browser, device, operating system, referrer, and timestamp
- Dashboard metrics, search, status filtering, sorting, and pagination
- Per-link analytics with charts
- QR code generation and download, if implemented
- Profile editing and password change, if implemented
- Responsive desktop, tablet, and mobile interface
- 404 page and error boundary, if implemented
- REST API for core features
- Automated backend tests

> Verify every feature against the actual code before publishing this README. Remove any feature that is not implemented and tested.

## Technology Stack

### Backend
- Python 3
- Django 5
- Django REST Framework
- Token authentication, subject to the actual configuration
- SQLite for development, if configured
- PostgreSQL for production, if configured

### Frontend
- React 18
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- Recharts
- Lucide React
- qrcode.react

Verify installed dependencies and actual usage before listing them.

### Deployment
- Render for the backend and database, if configured
- Vercel for the frontend, if configured

## Architecture

```text
Browser
   |
   v
React + Vite Frontend
   |
   v
Django REST API
   |
   v
PostgreSQL (production) / SQLite (development)
```

### Public Short-Link Redirect

```text
Visitor opens a short URL
   |
   v
Django redirect endpoint
   |
   v
Validate link and record click
   |
   v
Redirect to the original URL
```

## Project Structure

```text
ShortMetric/
├── backend/
│   ├── apps/
│   │   ├── users/       # Authentication and profile
│   │   ├── links/       # Link management and redirects
│   │   └── analytics/   # Click tracking and analytics
│   ├── config/          # Django configuration
│   ├── requirements/
│   └── manage.py
├── web/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── lib/
│   ├── package.json
│   └── vite.config.js
├── docs/
│   └── screenshots/
└── README.md
```

Adjust this structure to match the actual repository.

## Local Development

### Prerequisites

- Python 3
- Node.js and npm
- Git

### Backend — PowerShell

Run these commands from the repository root, assuming the virtual environment is in the root `venv` directory and the Django project is in `backend/`.

```powershell
.\venv\Scripts\Activate.ps1
Set-Location .\backend
python manage.py migrate
python manage.py runserver
```

The development backend normally runs at `http://127.0.0.1:8000`.

If your virtual environment or backend folder is in a different location, adjust the commands accordingly.

### Frontend — PowerShell

Open a second PowerShell terminal from the repository root:

```powershell
Set-Location .\web
npm install
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173/`.

If configured, Vite proxies `/api/` requests to Django during development.

## Environment Variables

Create local environment files from the corresponding example files, if provided. Never commit real secrets.

### Backend

Typical settings may include:

- `DJANGO_SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS`
- Database connection settings, such as `DATABASE_URL` or PostgreSQL variables
- Production settings for `DEBUG`, HTTPS, CORS, and CSRF, where applicable

### Frontend

- `VITE_API_BASE_URL`
- `VITE_SHORT_LINK_ORIGIN`

Use the actual variable names read by the application. Variables prefixed with `VITE_` are exposed to frontend code; never place secrets in them.

## API Endpoints

Confirm these routes and methods against the current Django URL configuration before publishing.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register/` | Register a user |
| POST | `/api/auth/login/` | Log in |
| POST | `/api/auth/logout/` | Log out |
| GET | `/api/auth/me/` | Retrieve the current profile |
| PATCH | `/api/auth/me/` | Update the current profile |
| POST | `/api/links/` | Create a short link |
| GET | `/api/links/` | List links, potentially with search/filter/sort/pagination |
| GET/PATCH/DELETE | `/api/links/<id>/` | Retrieve, update, or delete a link |
| GET | `/api/analytics/` | Retrieve dashboard analytics |
| GET | `/api/analytics/<link_id>/` | Retrieve per-link analytics |
| GET | `/<short_code>/` | Redirect and record a click |

Include a password-change endpoint only if it is implemented and verified.

## Database Models

Verify field names against the current models.

- **Profile:** User profile associated with the Django user.
- **Link:** Original URL, short code, activation state, expiration, owner, and timestamps.
- **Click:** Link reference, click timestamp, referrer, user agent, browser, device category, and operating system.

## Testing

### Backend — PowerShell

```powershell
Set-Location .\backend
python manage.py test
```

Run the tests and report the actual result. Do not claim a test count or successful run without verifying it.

Run additional checks where supported, including Django system checks, migration checks, and a production frontend build.

## Authentication

Document the authentication mechanism actually configured by the backend. If token authentication is used, explain how the frontend obtains and sends the token and how logout is handled.

Do not publish secrets, tokens, or real user credentials.

## Analytics

Analytics are recorded when public short links are visited, according to the implemented tracking logic. Display only metrics supported by collected data. Do not fabricate visitors, locations, or other analytics.

## Deployment

Document the actual deployment configuration.

### Backend
If using Render, document the web service, database, start command, migrations, and required environment variables.

### Frontend
If using Vercel, document the frontend root directory, build command, output directory, and production environment variables.

Ensure production URLs use HTTPS and the deployed backend origin. Keep `DEBUG` disabled in production and store secrets in the hosting platform's environment settings.

## Screenshots

Add genuine screenshots of the working application under `docs/screenshots/` when available.

Recommended screenshots:

- Landing page
- Dashboard
- Links management
- Analytics page

Use relative Markdown image paths and remove personal information or credentials. Do not invent screenshots or present fabricated analytics as real data.

## Project Notice

ShortMetric is an independently developed non-commercial portfolio and demonstration project created for educational, learning, and job-interview purposes.

ShortMetric is not affiliated with, sponsored by, endorsed by, or associated with any third-party company or organization.

The project uses its own implementation, branding, and user interface. Third-party libraries and dependencies remain subject to their respective licenses.

## License

MIT, only if the repository includes a valid MIT `LICENSE` file. Otherwise, add the appropriate license before claiming MIT licensing.
