import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft, Copy, Check, Save, Trash2, Power, PowerOff,
  ExternalLink, BarChart3, Pencil, X, Download,
} from 'lucide-react';
import { Input, Badge, LoadingState, ErrorState, ConfirmDialog } from '../components';
import { linksService } from '../services/linksService';
import { getShortUrl } from '../lib/shortUrl';

export default function LinkDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qrContainerRef = useRef(null);

  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ original_url: '', short_code: '', expires_at: '' });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await linksService.get(id);
      setLink(data);
      setForm({
        original_url: data.original_url,
        short_code: data.short_code,
        expires_at: data.expires_at ? new Date(data.expires_at).toISOString().slice(0, 16) : '',
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) setFormErrors({ ...formErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const next = {};
    const url = form.original_url.trim();
    if (!url) next.original_url = 'URL is required.';
    else {
      try {
        const parsed = new URL(url);
        if (!['http:', 'https:'].includes(parsed.protocol)) next.original_url = 'Must start with http:// or https://';
        else if (!parsed.hostname.includes('.')) next.original_url = 'Invalid domain.';
      } catch { next.original_url = 'Invalid URL.'; }
    }
    if (form.expires_at && new Date(form.expires_at) <= new Date()) {
      next.expires_at = 'Expiration must be in the future.';
    }
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        original_url: form.original_url.trim(),
        short_code: form.short_code.trim(),
        expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      };
      const updated = await linksService.update(id, payload);
      setLink(updated);
      setEditing(false);
      showToast('Link updated');
    } catch (err) {
      const data = err.response?.data;
      let msg = 'Failed to update.';
      if (data?.short_code) msg = Array.isArray(data.short_code) ? data.short_code[0] : data.short_code;
      else if (data?.original_url) msg = Array.isArray(data.original_url) ? data.original_url[0] : data.original_url;
      setFormErrors({ form: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const updated = await linksService.update(id, { is_active: !link.is_active });
      setLink(updated);
      showToast(updated.is_active ? 'Link enabled' : 'Link disabled');
    } catch {
      showToast('Failed to update status', 'error');
    } finally {
      setToggling(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShortUrl(link.short_code));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const handleDownloadQR = () => {
    if (!qrContainerRef.current) return;
    const svg = qrContainerRef.current.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const a = document.createElement('a');
      a.download = `${link.short_code}-qr.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await linksService.remove(id);
      navigate('/dashboard');
    } catch {
      showToast('Failed to delete', 'error');
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState message="Loading link..." />;
  if (error || !link) return <ErrorState message="Could not load this link." onRetry={load} />;

  const shortUrl = getShortUrl(link.short_code);
  const status = !link.is_active
    ? { label: 'Disabled', variant: 'danger' }
    : link.is_expired
    ? { label: 'Expired', variant: 'warning' }
    : { label: 'Active', variant: 'success' };

  return (
    <div className="max-w-3xl mx-auto">
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-3 py-2 rounded-md shadow-lg text-white text-xs ${
          toast.type === 'error' ? 'bg-danger' : 'bg-success'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <Link to="/dashboard" className="btn btn-ghost btn-sm">
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="page-title">Link Details</h1>
          <p className="text-xs text-ink-muted truncate">{link.original_url}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="card p-4 mb-4">
        <div className="section-label mb-2">Short URL</div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <a href={shortUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline break-all">
            {shortUrl}
          </a>
          <div className="flex gap-1.5">
            <button onClick={handleCopy} className="btn btn-outline btn-sm">
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <a href={shortUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
              <ExternalLink className="w-3.5 h-3.5" /> Open
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="card p-4">
          <div className="section-label mb-1">Clicks</div>
          <div className="text-2xl font-semibold text-ink-primary tabular-nums">{link.click_count}</div>
        </div>
        <div className="card p-4">
          <div className="section-label mb-1">Created</div>
          <div className="text-xs text-ink-secondary">{new Date(link.created_at).toLocaleDateString()}</div>
        </div>
        <div className="card p-4">
          <div className="section-label mb-1">Updated</div>
          <div className="text-xs text-ink-secondary">{new Date(link.updated_at).toLocaleDateString()}</div>
        </div>
        <div className="card p-4">
          <div className="section-label mb-1">Expiration</div>
          <div className="text-xs text-ink-secondary">
            {link.expires_at ? new Date(link.expires_at).toLocaleDateString() : 'Never'}
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="section-label mb-3">QR Code</div>
        <div className="flex items-start gap-4 flex-wrap">
          <div ref={qrContainerRef} className="bg-white p-2 border border-border rounded-md">
            <QRCodeSVG value={shortUrl} size={120} level="M" fgColor="#1B2528" />
          </div>
          <div className="flex-1 min-w-[180px]">
            <p className="text-xs text-ink-muted mb-3 leading-relaxed">
              Scan this QR code to open the short link. Download and print anywhere.
            </p>
            <button onClick={handleDownloadQR} className="btn btn-outline btn-sm">
              <Download className="w-3.5 h-3.5" /> Download PNG
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-ink-primary">
            {editing ? 'Edit Link' : 'Link Information'}
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="btn btn-outline btn-sm"
          >
            {editing ? <X className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {!editing ? (
          <div className="space-y-3">
            <div>
              <div className="section-label mb-1">Original URL</div>
              <div className="text-sm text-ink-secondary break-all">{link.original_url}</div>
            </div>
            <div>
              <div className="section-label mb-1">Alias</div>
              <div className="text-sm text-ink-secondary">{link.short_code}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3">
            {formErrors.form && (
              <div className="px-3 py-2 rounded-md bg-danger-light text-danger text-xs">
                {formErrors.form}
              </div>
            )}
            <Input id="original_url" name="original_url" type="url" label="Original URL"
              value={form.original_url} onChange={handleChange} error={formErrors.original_url} />
            <Input id="short_code" name="short_code" label="Alias"
              value={form.short_code} onChange={handleChange} error={formErrors.short_code} />
            <Input id="expires_at" name="expires_at" type="datetime-local" label="Expiration"
              value={form.expires_at} onChange={handleChange} error={formErrors.expires_at} />
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      <div className="card p-4 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-1.5 flex-wrap">
          <button onClick={handleToggle} disabled={toggling}
            className={`btn btn-sm ${link.is_active ? 'btn-outline' : 'btn-primary'}`}>
            {link.is_active ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
            {toggling ? 'Updating...' : link.is_active ? 'Disable' : 'Enable'}
          </button>
          <Link to={`/analytics/${link.id}`} className="btn btn-outline btn-sm">
            <BarChart3 className="w-3.5 h-3.5" /> Analytics
          </Link>
        </div>
        <button onClick={() => setConfirmDelete(true)} className="btn btn-danger-outline btn-sm">
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this link?"
        message="This action cannot be undone. The short URL will stop working immediately."
        confirmLabel="Delete Link"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        loading={deleting}
      />
    </div>
  );
}
