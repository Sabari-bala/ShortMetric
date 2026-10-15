import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Mail, Calendar, Link2, MousePointerClick, CheckCircle2, XCircle,
  Pencil, X, Save, Lock, ArrowRight,
} from 'lucide-react';
import { MetricCard, LoadingState, ErrorState, Input, Badge } from '../components';
import { authService } from '../services/authService';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../hooks/useAuth';
import { getShortUrl } from '../lib/shortUrl';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: '', email: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);
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
      setProfileForm({ username: p.username || '', email: p.email || '' });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileErrors({});
    const next = {};
    if (!profileForm.username.trim()) next.username = 'Required.';
    if (profileForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) next.email = 'Invalid email.';
    if (Object.keys(next).length) return setProfileErrors(next);

    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile({
        username: profileForm.username.trim(),
        email: profileForm.email.trim(),
      });
      if (updated.username !== user.username) localStorage.setItem('username', updated.username);
      setProfile({ ...profile, username: updated.username, email: updated.email });
      setEditingProfile(false);
      showToast('Profile updated');
    } catch (err) {
      setProfileErrors(err.response?.data || {});
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordErrors({});
    const next = {};
    if (!passwordForm.current_password) next.current_password = 'Required.';
    if (!passwordForm.new_password) next.new_password = 'Required.';
    else if (passwordForm.new_password.length < 8) next.new_password = 'Minimum 8 characters.';
    if (passwordForm.new_password !== passwordForm.confirm_password) next.confirm_password = 'Passwords do not match.';
    if (Object.keys(next).length) return setPasswordErrors(next);

    setSavingPassword(true);
    try {
      await authService.changePassword(passwordForm);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      setEditingPassword(false);
      showToast('Password changed');
    } catch (err) {
      setPasswordErrors(err.response?.data || {});
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error || !profile) return <ErrorState message="Could not load profile." onRetry={load} />;

  const memberDays = Math.floor((Date.now() - new Date(profile.date_joined).getTime()) / (1000 * 60 * 60 * 24));
  const recentLinks = profile.recent_links || [];

  return (
    <div className="max-w-4xl mx-auto">
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-3 py-2 rounded-md shadow-lg text-white text-xs ${
          toast.type === 'error' ? 'bg-danger' : 'bg-success'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-6">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Your account information and activity.</p>
      </div>

      {/* Account overview */}
      <div className="card p-4 mb-4">
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
          <button onClick={() => setEditingProfile(!editingProfile)} className="btn btn-outline btn-sm">
            {editingProfile ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
            {editingProfile ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {!editingProfile && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-border text-xs text-ink-muted">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {profile.email || 'No email'}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Joined {new Date(profile.date_joined).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-1.5">
              Member for {memberDays} {memberDays === 1 ? 'day' : 'days'}
            </div>
          </div>
        )}

        {editingProfile && (
          <form onSubmit={handleProfileSave} className="mt-4 pt-4 border-t border-border space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input id="username" label="Username"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                error={profileErrors.username} />
              <Input id="email" type="email" label="Email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                error={profileErrors.email} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={savingProfile}>
              <Save className="w-3.5 h-3.5" />
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      {/* Metrics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <MetricCard label="Total Links" value={stats.total_links} subtitle="All time" icon={Link2} accent="primary" />
          <MetricCard label="Total Clicks" value={stats.total_clicks} subtitle="All time" icon={MousePointerClick} accent="primary" />
          <MetricCard label="Active" value={stats.active_links} subtitle="Currently live" icon={CheckCircle2} accent="success" />
          <MetricCard label="Expired" value={stats.expired_links} subtitle="Not redirecting" icon={XCircle} accent="warning" />
        </div>
      )}

      {/* Recent links */}
      {recentLinks.length > 0 && (
        <div className="card p-4 mb-4">
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

      {/* Password */}
      <div className="card p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-ink-muted" />
            <span className="text-sm font-semibold text-ink-primary">Password</span>
          </div>
          <button onClick={() => setEditingPassword(!editingPassword)} className="btn btn-outline btn-sm">
            {editingPassword ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
            {editingPassword ? 'Cancel' : 'Change'}
          </button>
        </div>

        {!editingPassword && (
          <p className="text-xs text-ink-muted mt-3">
            Keep your account secure. Change your password regularly.
          </p>
        )}

        {editingPassword && (
          <form onSubmit={handlePasswordSave} className="mt-4 space-y-3">
            <Input id="current_password" type="password" label="Current password"
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              error={passwordErrors.current_password}
              autoComplete="current-password" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input id="new_password" type="password" label="New password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                error={passwordErrors.new_password}
                autoComplete="new-password" />
              <Input id="confirm_password" type="password" label="Confirm new password"
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                error={passwordErrors.confirm_password}
                autoComplete="new-password" />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={savingPassword}>
              <Save className="w-3.5 h-3.5" />
              {savingPassword ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
