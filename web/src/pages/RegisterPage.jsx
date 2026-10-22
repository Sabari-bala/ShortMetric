import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim()) return setError('Username is required.');
    if (!form.email.trim()) return setError('Email is required.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.password2) return setError('Passwords do not match.');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Registration failed.';
      if (data) {
        const key = data.username ? 'username' : data.email ? 'email' : data.password ? 'password' : null;
        if (key) msg = Array.isArray(data[key]) ? data[key][0] : data[key];
        else if (data.detail) msg = data.detail;
      }
      setError(msg);
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
          <h1 className="text-lg font-semibold text-ink-primary">Create account</h1>
          <p className="text-xs text-ink-muted mt-1">Start shortening links in seconds</p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-md bg-danger-light text-danger text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <Input id="username" label="Username"
            placeholder="Choose a username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            autoComplete="username" autoFocus />
          <Input id="email" type="email" label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email" />
          <Input id="password" type="password" label="Password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password" />
          <Input id="password2" type="password" label="Confirm Password"
            placeholder="Re-enter password"
            value={form.password2}
            onChange={(e) => setForm({ ...form, password2: e.target.value })}
            autoComplete="new-password" />

          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            <UserPlus className="w-3.5 h-3.5" />
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-xs text-ink-secondary mt-5">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}
