import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Link as LinkIcon, BarChart3, User,
  Plus, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const primaryNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/links',     label: 'Links',     icon: LinkIcon },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const secondaryNav = [
  { to: '/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavItem = ({ to, label, icon: Icon, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2.5 h-8 px-2.5 rounded-md text-[13px] font-medium transition-colors duration-100 ${
          isActive
            ? 'bg-primary-light text-primary'
            : 'text-ink-secondary hover:bg-surface-hover hover:text-ink-primary'
        }`
      }
    >
      <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
      <span className="truncate">{label}</span>
    </NavLink>
  );

  const SidebarContent = ({ onNavClick }) => (
    <>
      <div className="h-14 flex items-center px-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold text-ink-primary tracking-tight">
          <span className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white text-[11px] font-bold">
            S
          </span>
          ShortMetric
        </Link>
      </div>

      <div className="p-3">
        <Link
          to="/create-link"
          onClick={onNavClick}
          className="btn btn-primary w-full btn-sm"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.25} />
          Create Link
        </Link>
      </div>

      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {primaryNav.map((item) => (
          <NavItem key={item.to} {...item} onClick={onNavClick} />
        ))}

        <div className="pt-3 mt-3 border-t border-border">
          <div className="px-2.5 mb-1.5 section-label">Account</div>
          {secondaryNav.map((item) => (
            <NavItem key={item.to} {...item} onClick={onNavClick} />
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-2.5 h-8 mb-1">
          <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-semibold text-primary">
              {user?.username?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <span className="text-xs text-ink-primary truncate font-medium">
            {user?.username}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full h-8 px-2.5 rounded-md text-[13px] font-medium text-ink-secondary hover:bg-danger-light hover:text-danger transition-colors duration-100"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-bg">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-surface border-r border-border fixed inset-y-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-surface border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold text-ink-primary">
          <span className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white text-[11px] font-bold">
            S
          </span>
          ShortMetric
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md hover:bg-surface-hover"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-30 bg-ink-primary/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed top-14 bottom-0 left-0 w-64 z-40 bg-surface border-r border-border flex flex-col shadow-lg">
            <SidebarContent onNavClick={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* Content */}
      <div className="flex-1 md:ml-56 pt-14 md:pt-0 min-w-0">
        <main className="px-4 md:px-8 py-6 md:py-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
