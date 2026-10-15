import { Link } from 'react-router-dom';
import { BarChart3, FileText, Trash2, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { getShortUrl } from '../lib/shortUrl';

function CopyIconButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`w-7 h-7 inline-flex items-center justify-center rounded-md transition-colors ${
        copied ? 'text-success bg-success-light' : 'text-ink-muted hover:bg-surface-hover hover:text-ink-primary'
      }`}
      aria-label={copied ? 'Copied' : 'Copy URL'}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function StatusLabel({ link }) {
  const status = !link.is_active
    ? { label: 'Disabled', dot: 'bg-danger', text: 'text-danger' }
    : link.is_expired
    ? { label: 'Expired', dot: 'bg-warning', text: 'text-warning' }
    : { label: 'Active', dot: 'bg-success', text: 'text-success' };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
      <span className={status.text}>{status.label}</span>
    </span>
  );
}

export default function LinkCard({ link, onDelete }) {
  const shortUrl = getShortUrl(link.short_code);

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-primary hover:underline truncate"
            >
              /{link.short_code}
            </a>
            <CopyIconButton text={shortUrl} />
          </div>
          <div className="text-xs text-ink-muted truncate" title={link.original_url}>
            {link.original_url}
          </div>
        </div>
        <StatusLabel link={link} />
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs text-ink-secondary">
        <div>
          <span className="font-semibold text-ink-primary">{link.click_count}</span> clicks
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-3 border-t border-border">
        <Link to={`/analytics/${link.id}`} className="btn btn-outline btn-sm flex-1 justify-center">
          <BarChart3 className="w-3.5 h-3.5" /> Analytics
        </Link>
        <Link to={`/link-details/${link.id}`} className="btn btn-outline btn-sm flex-1 justify-center">
          <FileText className="w-3.5 h-3.5" /> Details
        </Link>
        <a href={shortUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm justify-center">
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button onClick={() => onDelete(link.id)} className="btn btn-danger-outline btn-sm justify-center">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
