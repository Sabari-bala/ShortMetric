import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Copy, Check, BarChart3, FileText } from 'lucide-react';
import { Input } from '../components';
import { linksService } from '../services/linksService';
import { getShortUrl } from '../lib/shortUrl';

const RESERVED_ALIASES = [
  'api', 'admin', 'login', 'register', 'dashboard', 'analytics',
  'profile', 'links', 'create-link', 'link-details', 'static', 'media',
];

export default function CreateLinkPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ original_url: '', short_code: '', expires_at: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const next = {};
    const url = form.original_url.trim();
    if (!url) {
      next.original_url = 'Destination URL is required.';
    } else {
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          next.original_url = 'URL must start with http:// or https://';
        } else if (!parsed.hostname.includes('.')) {
          next.original_url = 'URL must include a valid domain (e.g., example.com)';
        }
      } catch {
        next.original_url = 'Please enter a valid URL (e.g., https://example.com)';
      }
    }
    const alias = form.short_code.trim();
    if (alias) {
      if (!/^[a-zA-Z0-9]+$/.test(alias)) next.short_code = 'Letters and numbers only.';
      else if (alias.length < 3) next.short_code = 'Minimum 3 characters.';
      else if (alias.length > 30) next.short_code = 'Maximum 30 characters.';
      else if (RESERVED_ALIASES.includes(alias.toLowerCase())) next.short_code = 'This alias is reserved.';
    }
    if (form.expires_at && new Date(form.expires_at) <= new Date()) {
      next.expires_at = 'Expiration must be in the future.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { original_url: form.original_url.trim() };
      if (form.short_code.trim()) payload.short_code = form.short_code.trim();
      if (form.expires_at) payload.expires_at = new Date(form.expires_at).toISOString();
      const data = await linksService.create(payload);
      setCreated(data);
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Failed to create link.';
      if (data) {
        const key = data.original_url ? 'original_url' : data.short_code ? 'short_code' : null;
        if (key) msg = Array.isArray(data[key]) ? data[key][0] : data[key];
        else if (data.detail) msg = data.detail;
      }
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!created) return;
    const url = getShortUrl(created.short_code);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleCreateAnother = () => {
    setCreated(null);
    setForm({ original_url: '', short_code: '', expires_at: '' });
    setErrors({});
  };

  if (created) {
    const shortUrl = getShortUrl(created.short_code);
    return (
      <div className="max-w-xl mx-auto">
        <div className="card p-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-success-light flex items-center justify-center mb-4">
            <Check className="w-5 h-5 text-success" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-semibold text-ink-primary mb-1">Your link is ready!</h2>
          <p className="text-xs text-ink-muted mb-6">Copy and share it anywhere.</p>

          <div className="bg-surface-muted border border-border rounded-md p-3 mb-4 flex items-center justify-between gap-2 flex-wrap">
            <a href={shortUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary break-all text-left">
              {shortUrl}
            </a>
            <button onClick={handleCopy} className="btn btn-outline btn-sm">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="text-2xs text-ink-muted mb-6 break-all">
            <span className="font-medium">Destination:</span> {created.original_url}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={handleCreateAnother} className="btn btn-outline btn-sm">
              <PlusCircle className="w-3.5 h-3.5" /> Create Another
            </button>
            <Link to={`/analytics/${created.id}`} className="btn btn-primary btn-sm">
              <BarChart3 className="w-3.5 h-3.5" /> View Analytics
            </Link>
            <Link to={`/link-details/${created.id}`} className="btn btn-outline btn-sm">
              <FileText className="w-3.5 h-3.5" /> Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="page-title">Create a short link</h1>
        <p className="page-subtitle">Shorten any URL, optionally customize the alias, and start tracking clicks.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 space-y-4" noValidate>
        {errors.form && (
          <div className="px-3 py-2 rounded-md bg-danger-light text-danger text-xs">
            {errors.form}
          </div>
        )}

        <Input
          id="original_url"
          name="original_url"
          type="url"
          label="Destination URL"
          placeholder="https://example.com/your-page"
          value={form.original_url}
          onChange={handleChange}
          error={errors.original_url}
          autoFocus
        />

        <Input
          id="short_code"
          name="short_code"
          label="Custom alias (optional)"
          placeholder="my-link"
          value={form.short_code}
          onChange={handleChange}
          error={errors.short_code}
          helper="Letters and numbers only. 3-30 characters. Leave blank to auto-generate."
        />

        <Input
          id="expires_at"
          name="expires_at"
          type="datetime-local"
          label="Expiration (optional)"
          value={form.expires_at}
          onChange={handleChange}
          error={errors.expires_at}
          helper="The link stops redirecting after this date."
        />

        <div className="flex gap-2 pt-2">
          <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Link'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline"
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
