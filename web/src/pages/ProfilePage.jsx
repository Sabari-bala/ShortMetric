import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  User, Mail, Calendar, Link2, MousePointerClick, CheckCircle2, XCircle,
  Pencil, X, Save, Lock, ArrowRight, Settings as SettingsIcon,
} from 'lucide-react';
import { MetricCard, LoadingState, ErrorState, Input, Badge } from '../components';
import { authService } from '../services/authService';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../hooks/useAuth';
import { getShortUrl } from '../lib/shortUrl';

const TABS = [
  { id: 'profile',  label: 'Profile',  icon: User },
  { id: 'security', label: 'Security', icon: Lock },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = TABS.some((t) => t.id === searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'profile';

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [p, s] = await Promise.all([authService.getProfile(), analyticsService.dashboard()]);
      setProfile(p);
      setStats(s);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error || !profile) return <ErrorState message="Could not load profile." onRetry={load} />;

  return (
    <div className="max-w-4xl mx-auto">
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-3 py-2 rounded-md shadow-lg text-white text-xs ${
          toast.type === 'error' ? 'bg-danger' : 'bg-success'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="mb-6">
        <h1 className="page-title">Profile & Settings</h1>
        <p className="page-subtitle">Manage your account information and security.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <div className="flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSearchParams(id === 'profile' ? {} : { tab: id })}
              className={`inline-flex items-center gap-2 px-4 py-2.5 -mb-px border-b-2 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-secondary hover:text-ink-primary'
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'profile' && (
        <ProfileTab
          profile={profile}
          stats={stats}
          user={user}
          onUpdate={(updated) => {
            setProfile({ ...profile, ...updated });
            showToast('Profile updated');
          }}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}

      {activeTab === 'security' && (
        <SecurityTab onSuccess={() => showToast('Password changed')} />
      )}
    </div>
  );
}

// ---------- Profile Tab ----------
function ProfileTab({ profile, stats, user, onUpdate, onError }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: profile.username || '', email: profile.email || '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    const next = {};
    if (!form.username.trim()) next.username = 'Required.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Invalid email.';
    if (Object.keys(next).length) return setErrors(next);

    setSaving(true);
    try {
      const updated = await authService.updateProfile({
        username: form.username.trim(),
        email: form.email.trim(),
      });
      if (updated.username !== user.username) localStorage.setItem('username', updated.username);
          if (updated.token) localStorage.setItem('token', updated.token);
          if (updated.token) localStorage.setItem('token', updated.token);
      onUpdate(updated);
      setEditing(false);
    } catch (err) {
      setErrors(err.response?.data || {});
      onError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const memberDays = Math.floor(
    (Date.now() - new Date(profile.date_joined).getTime()) / (1000 * 60 * 60 * 24)
  );
  const recentLinks = profile.recent_links || [];

  return (
    <div className="space-y-4">
      {/* Account overview */}
      <div className="card p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-ink-primary truncate">{profile.username}</h2>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="text-xs text-ink-muted truncate">{profile.email || 'No email set'}</div>
            </div>
          </div>
          <button onClick={() => setEditing(!editing)} className="btn btn-outline btn-sm">
            {editing ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {!editing && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-border text-xs text-ink-muted">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {profile.email || 'No email'}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Joined {new Date(profile.date_joined).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-1.5">
              Member for {memberDays} {memberDays === 1 ? 'day' : 'days'}
            </div>
          </div>
        )}

        {editing && (
          <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input id="username" label="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                error={errors.username} />
              <Input id="email" type="email" label="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={errors.email} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      {/* Metrics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Total Links" value={stats.total_links} subtitle="All time" icon={Link2} accent="primary" />
          <MetricCard label="Total Clicks" value={stats.total_clicks} subtitle="All time" icon={MousePointerClick} accent="primary" />
          <MetricCard label="Active" value={stats.active_links} subtitle="Currently live" icon={CheckCircle2} accent="success" />
          <MetricCard label="Expired" value={stats.expired_links} subtitle="Not redirecting" icon={XCircle} accent="warning" />
        </div>
      )}

      {/* Recent links */}
      {recentLinks.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="section-label">Recent Links</div>
            <Link to="/dashboard" className="text-2xs font-medium text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-0.5">
            {recentLinks.slice(0, 4).map((link) => {
              const shortUrl = getShortUrl(link.short_code);
              return (
                <div key={link.id} className="flex items-center justify-between gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-surface-hover transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-md bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <a href={shortUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline block truncate">
                        /{link.short_code}
                      </a>
                      <div className="text-2xs text-ink-muted truncate">{link.original_url}</div>
                    </div>
                  </div>
                  <div className="text-2xs text-ink-muted flex-shrink-0 tabular-nums">
                    {link.click_count} {link.click_count === 1 ? 'click' : 'clicks'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Security Tab ----------
function SecurityTab({ onSuccess }) {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const next = {};
    if (!form.current_password) next.current_password = 'Required.';
    if (!form.new_password) next.new_password = 'Required.';
    else if (form.new_password.length < 8) next.new_password = 'Minimum 8 characters.';
    if (form.new_password !== form.confirm_password) next.confirm_password = 'Passwords do not match.';
    if (Object.keys(next).length) return setErrors(next);

    setSaving(true);
    try {
      await authService.changePassword(form);
      setForm({ current_password: '', new_password: '', confirm_password: '' });
      onSuccess();
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card p-6 max-w-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-md bg-primary-light flex items-center justify-center">
          <Lock className="w-4 h-4 text-primary" strokeWidth={2} />
        </div>
        <div>
          <div className="text-sm font-semibold text-ink-primary">Change password</div>
          <div className="text-xs text-ink-muted">Keep your account secure.</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          id="current_password"
          type="password"
          label="Current password"
          value={form.current_password}
          onChange={(e) => setForm({ ...form, current_password: e.target.value })}
          error={errors.current_password}
          autoComplete="current-password"
        />
        <Input
          id="new_password"
          type="password"
          label="New password"
          helper="Minimum 8 characters."
          value={form.new_password}
          onChange={(e) => setForm({ ...form, new_password: e.target.value })}
          error={errors.new_password}
          autoComplete="new-password"
        />
        <Input
          id="confirm_password"
          type="password"
          label="Confirm new password"
          value={form.confirm_password}
          onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
          error={errors.confirm_password}
          autoComplete="new-password"
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          <Save className="w-3.5 h-3.5" />
          {saving ? 'Saving...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

