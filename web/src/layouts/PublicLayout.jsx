import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold text-ink-primary">
            <span className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white text-[11px] font-bold">
              S
            </span>
            ShortMetric
          </Link>
          <nav className="flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-ghost btn-sm">
                  Dashboard
                </Link>
                <Link to="/create-link" className="btn btn-ghost btn-sm">
                  Create Link
                </Link>
                <span className="hidden md:inline text-xs text-ink-muted px-2">
                  {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm text-ink-secondary hover:text-danger"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/#features" className="btn btn-ghost btn-sm">Features</a>
                <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-xs text-ink-muted">
          ShortMetric is an independent portfolio project.
        </div>
      </footer>
    </div>
  );
}
