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
                <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
                <Link to="/create-link" className="btn btn-ghost btn-sm">Create Link</Link>
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
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span className="w-4 h-4 rounded bg-primary flex items-center justify-center text-white text-[9px] font-bold">S</span>
            ShortMetric — Short links. Clear insights.
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-muted">
            <a href="/#features" className="hover:text-ink-primary transition-colors">Features</a>
            <Link to="/register" className="hover:text-ink-primary transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
