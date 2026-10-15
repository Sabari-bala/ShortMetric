# ShortMetric 🔗

**Short links. Clear insights.**

ShortMetric is a full-stack URL shortening and click analytics application built to make sharing links simpler and help users understand how their links perform.

## ✨ Features

- Create short links from longer URLs.
- Access and manage shortened links through the web interface.
- View click analytics for supported links.
- Explore available traffic insights, such as browser, device, operating system, and referrer, where implemented.
- Use the responsive interface across desktop and mobile screens.

> Feature availability depends on the current implementation. Refer to the application itself for the supported functionality.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript

### Backend
- Python
- Django
- Django REST Framework

### Database
- SQLite for local development, subject to the current configuration.
- PostgreSQL for production, if configured.

## 🏗️ Architecture

ShortMetric separates its frontend interface from its backend API.

1. The React frontend provides the user interface.
2. The Django REST Framework backend processes supported API requests.
3. The configured database stores application data.
4. The frontend communicates with the backend through HTTP requests.

## 📁 Project Structure

```text
ShortMetric/
├── backend/       # Django backend
├── web/           # React and Vite frontend
├── docs/          # Project documentation
├── .env.example   # Example environment configuration
├── .gitignore
├── LICENSE
└── README.md
```

This is a high-level overview; the exact files and folders may differ.

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- Python
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Sabari-bala/ShortMetric.git
cd ShortMetric
```

### 2. Set up the backend

From the project root, create and activate a Python virtual environment.

**Windows PowerShell:**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies using the dependency file provided in the `backend` directory. For example, if the project contains `requirements.txt`:

```powershell
pip install -r .\backend\requirements.txt
```

Configure the required environment variables using the project's actual settings and `.env.example`. Do not commit real credentials or secret keys.

Run migrations and start the Django development server using the project's configured Django settings and entry point.

### 3. Set up the frontend

```powershell
Set-Location .\web
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal.

### 4. Build the frontend

From the `web` directory:

```powershell
npm run build
```

The build output is generated in the `dist` directory by default.

> Follow the actual project configuration if dependency files, environment variables, API URLs, or run commands differ from these examples.

## 🔐 Configuration and Security

- Keep secret keys, database passwords, and API credentials out of source control.
- Use `.env.example` as a template, not as a place to store production secrets.
- Configure allowed hosts, CORS, database connections, and debug settings appropriately before production deployment.
- Use HTTPS for deployed applications.
- Validate URLs and handle invalid or unsafe requests on the backend.

## 🧪 Testing

Run the tests supported by the current backend and frontend setup before releasing changes. Test commands depend on the project's installed dependencies and configuration.

## 🌐 Deployment

The frontend and backend can be deployed separately when their production configurations are ready.

Before deployment, verify:

- Production environment variables and database configuration.
- Frontend API base URL.
- Backend CORS and allowed-host settings.
- Database migrations and static assets.
- Build results and essential application flows.

Add the actual live application URL here after deployment has been completed and verified.

## 🎯 Project Goal

ShortMetric is a portfolio project focused on full-stack development, REST API integration, database-backed application design, and practical analytics functionality.

## 📄 License

See the [LICENSE](LICENSE) file for the applicable license.
