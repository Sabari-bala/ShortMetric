import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    const to = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={to} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim() || !form.password) return setError('Please fill in both fields.');
    setSubmitting(true);
    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <div className="card p-6">
        <div className="text-center mb-6">
          <div className="w-10 h-10 mx-auto rounded-md bg-primary flex items-center justify-center text-white text-base font-bold mb-3">
            S
          </div>
          <h1 className="text-lg font-semibold text-ink-primary">Welcome back</h1>
          <p className="text-xs text-ink-muted mt-1">Log in to manage your links</p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-md bg-danger-light text-danger text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <Input id="username" name="username" label="Username"
            placeholder="Enter your username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoComplete="username" autoFocus />
          <Input id="password" name="password" type="password" label="Password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password" />

          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            <LogIn className="w-3.5 h-3.5" />
            {submitting ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <div className="text-center text-xs text-ink-secondary mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}
