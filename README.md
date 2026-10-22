# ShortMetric

**Short links. Clear insights.**

ShortMetric is a full-stack link management and click analytics platform built to demonstrate practical full-stack engineering, from authentication and REST API development to database integration, analytics, and cloud deployment.

## 🌐 Live Demo

- **Live Application:** https://shortmetric.vercel.app
- **Backend API:** https://shortmetric-api.onrender.com
- **Source Code:** https://github.com/Sabari-bala/ShortMetric

**Demo account**

- Username: `SabariBalaMR`
- Password: `ShortMetric@2026`

> **Note:** The backend uses a free hosting tier and may take 30–60 seconds to wake up after inactivity. Demo credentials are public, so the account should contain demonstration data only.

## 📌 Overview

ShortMetric makes long URLs easier to share and helps users understand how their links perform.

Users can create short URLs, manage custom aliases, generate QR codes, control link expiration, and analyze click activity through a centralized dashboard.

### What You Can Do

- Create short links with automatically generated codes or custom aliases.
- Edit, enable, disable, and delete links.
- Configure link expiration dates.
- Generate and download QR codes.
- Track clicks and inspect browser, device, operating system, and referrer information.
- View interactive analytics for individual links.
- Search, filter, sort, and paginate through links.

## ✨ Features

### Authentication and Profile Management

- Token-based registration, login, and logout.
- Protected frontend routes.
- Session-expiry handling.
- Profile editing for username and email.
- Password changes with current-password verification.
- Per-user data isolation enforced by the backend.

### Link Management

- Create short links from valid URLs.
- Generate six-character short codes automatically.
- Create custom aliases with validation and reserved-word protection.
- Prevent duplicate original URLs for the same user.
- Edit and delete links with confirmation.
- Enable or disable links without deleting them.
- Configure expiration dates.
- Generate and download QR codes as PNG files.

### Public Redirect System

- Public short-link endpoint using `/<short_code>/`.
- Server-side validation of link existence, active status, and expiration.
- Click recording before redirecting to the original destination.
- Click metadata including timestamp, browser, device category, operating system, referrer, and user agent.
- Custom user-agent parsing without an external parsing dependency.

### Analytics Dashboard

- Overview metrics for total links, total clicks, active links, and expired links.
- Search by short code or original URL.
- Filter links by active, inactive, and expired status.
- Sort by newest, oldest, most clicks, and least clicks.
- Server-side pagination.
- Click activity over time.
- Device, browser, and operating-system breakdowns.
- Recent click activity for individual links.

### User Interface and Experience

- Responsive layouts for desktop, tablet, and mobile.
- Custom Tailwind CSS design system.
- Reusable React components.
- Compact dashboard navigation and mobile-friendly layouts.
- Toast notifications and copy-to-clipboard feedback.
- Loading, empty, and error states.
- 404 fallback and error boundary.

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | Component-based user interface |
| Vite | Development server and production build tooling |
| React Router v6 | Client-side routing |
| TanStack Query | Server-state management and data fetching |
| Axios | HTTP client and API communication |
| Tailwind CSS | Responsive styling and custom design system |
| Recharts | Interactive analytics charts |
| Lucide React | Interface icons |
| qrcode.react | QR code generation |

### Backend

| Technology | Purpose |
|---|---|
| Python 3 | Backend programming language |
| Django 5 | Web framework and application logic |
| Django REST Framework | REST API development |
| DRF TokenAuthentication | API authentication |
| Django ORM | Database queries and data access |
| django-cors-headers | Cross-origin resource sharing configuration |
| Gunicorn | Production WSGI server |
| WhiteNoise | Static-file serving |
| dj-database-url | Database connection configuration |
| python-dotenv | Environment-variable configuration |

### Database

- **PostgreSQL:** Production database.
- **SQLite:** Local development database.

### Deployment and Development Tools

- **Render:** Backend hosting and managed PostgreSQL.
- **Vercel:** Frontend hosting.
- **Git:** Version control.
- **GitHub:** Source-code hosting and repository management.

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│         User Browser         │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       React 18 + Vite        │
│  UI, Routing, API Requests   │
└──────────────┬───────────────┘
               │ HTTPS / REST API
               ▼
┌──────────────────────────────┐
│     Django REST Framework    │
│ Authentication and Business  │
│ Logic and Analytics          │
└──────────────┬───────────────┘
               │ Django ORM
               ▼
┌──────────────────────────────┐
│ PostgreSQL / SQLite          │
│ Users, Links, Click Events   │
└──────────────────────────────┘
```

### Public Redirect Flow

```text
Visitor opens a short URL
          │
          ▼
Django redirect endpoint
          │
          ▼
Check whether the link exists
          │
          ▼
Validate active status and expiration
          │
          ▼
Record click metadata
          │
          ▼
Redirect to the original URL
```

## 🗄️ Database Design

### User

Django's built-in user model manages user accounts and authentication.

### Profile

A one-to-one relationship with the Django user stores additional profile information.

### Link

Stores short-link configuration and ownership.

- `user` — foreign key to the link owner.
- `original_url` — destination URL.
- `short_code` — unique short code.
- `is_active` — enabled or disabled state.
- `expires_at` — optional expiration timestamp.
- `created_at` and `updated_at` — timestamps.

### Click

Stores click-event information for analytics.

- `link` — foreign key to the associated link.
- `clicked_at` — click timestamp.
- `referrer` — referring source.
- `user_agent` — browser user-agent string.
- `browser` — detected browser.
- `device_category` — detected device category.
- `operating_system` — detected operating system.

## 💡 Skills Demonstrated

- **Frontend engineering:** React component architecture, routing, responsive UI, and state management.
- **API integration:** Connecting a React frontend to a Django REST API using Axios and TanStack Query.
- **Backend engineering:** REST API design, request validation, authentication, and business logic.
- **Database management:** Relational data modeling, ORM queries, and PostgreSQL integration.
- **Analytics:** Capturing click events and visualizing usage data.
- **Application security:** Authentication, authorization, and per-user data isolation.
- **Production deployment:** Configuring separate frontend and backend services.
- **Debugging:** Resolving deployment configuration, CORS, environment-variable, and encoding issues.
- **Developer workflow:** Git, GitHub, environment configuration, and production builds.

## 📁 Project Structure

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
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Install the following:

- Python 3.10 or later.
- Node.js 18 or later and npm.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/Sabari-bala/ShortMetric.git
cd ShortMetric
```

### 2. Set Up the Backend

Run the following commands from the project root in Windows PowerShell:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend\requirements\development.txt
cd backend
python manage.py migrate
python manage.py runserver
```

The backend runs at:

http://127.0.0.1:8000

### 3. Set Up the Frontend

Open a second terminal from the project root:

```powershell
cd web
npm install
npm run dev
```

The frontend runs at:

http://localhost:5173

During local development, Vite proxies API requests to Django according to the project's Vite configuration.

### 4. Configure Environment Variables

Use the environment example files provided by the project to configure local and production environments.

**Backend configuration may include:**

- `DJANGO_SECRET_KEY`
- `DJANGO_ALLOWED_HOSTS`
- `DATABASE_URL`
- `DJANGO_DEBUG`

**Frontend configuration:**

- `VITE_API_BASE_URL`
- `VITE_SHORT_LINK_ORIGIN`

Use the formats expected by the project's settings and Vite configuration. Never commit real secret keys, database credentials, or private environment files.

## 🔌 API Endpoints

The following table summarizes the main application endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register/` | Register a user |
| `POST` | `/api/auth/login/` | Log in |
| `POST` | `/api/auth/logout/` | Log out |
| `GET` | `/api/auth/me/` | Retrieve the current profile |
| `PATCH` | `/api/auth/me/` | Update the profile |
| `POST` | `/api/auth/change-password/` | Change the password |
| `GET` | `/api/links/` | List links |
| `POST` | `/api/links/` | Create a link |
| `GET` | `/api/links/<id>/` | Retrieve a link |
| `PATCH` | `/api/links/<id>/` | Update a link |
| `DELETE` | `/api/links/<id>/` | Delete a link |
| `GET` | `/api/analytics/` | Retrieve dashboard analytics |
| `GET` | `/api/analytics/<link_id>/` | Retrieve per-link analytics |
| `GET` | `/<short_code>/` | Redirect through a short link |

### Link List Query Parameters

| Parameter | Purpose |
|---|---|
| `page` | Select a results page |
| `search` | Search by short code or original URL |
| `status` | Filter by link status |
| `sort` | Sort by date or click count |

## 🧪 Testing

Run the backend test suite from the project root:

```powershell
cd backend
python manage.py test
```

The project's test coverage includes authentication, authorization, link CRUD operations, redirect behavior, click tracking, and analytics permissions.

## 🌱 Demo Data

The project includes a custom Django management command for populating the demo database with sample links and click activity.

Run it from the backend directory:

```powershell
python manage.py seed_demo
```

Use this command only when appropriate for the target database. It can modify database contents, so verify the configured database before running it, especially in production.

## ☁️ Deployment

### Backend — Render

The backend is deployed as a Django web service with PostgreSQL for production data.

Deployment configuration includes:

- Production Python dependencies.
- The appropriate production Django settings.
- Static-file collection.
- Database migrations.
- Gunicorn as the WSGI server.
- Environment variables for secrets, hosts, and the database connection.

The exact build command must match the project's configured production build script and Render service root directory.

### Frontend — Vercel

The React frontend is deployed separately through Vercel.

Typical Vite deployment settings:

- **Framework:** Vite.
- **Build command:** `npm run build`.
- **Output directory:** `dist`.
- **Project root:** `web/`, when deploying from the frontend subdirectory.

Configure `VITE_API_BASE_URL` and `VITE_SHORT_LINK_ORIGIN` in the Vercel project settings with the correct production values.

## 🔧 Production Debugging and Engineering Highlights

During development and deployment, the project required resolving several real-world configuration issues:

- **Django static files:** Addressed a `STATIC_ROOT` configuration issue on Render by ensuring production settings were active during the build.
- **CORS and API routing:** Configured cross-origin handling and corrected frontend API URL configuration to avoid duplicated `/api/api/` paths.
- **Environment variables:** Corrected deployment configuration so environment variables supplied the intended values.
- **Windows file encoding:** Removed unwanted UTF-8 byte-order marks from frontend files that caused problems during the Vercel build.
- **Demo data:** Created a Django management command to populate demonstration links and click activity for analytics.

These experiences provided practical exposure to debugging issues that appear when moving an application from local development to production.

## 📜 License

See the [`LICENSE`](LICENSE) file for the applicable license terms.

---

**ShortMetric — Short links. Clear insights.**
