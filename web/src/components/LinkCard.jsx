import { Link } from 'react-router-dom';
import { BarChart3, FileText, Trash2, ExternalLink } from 'lucide-react';
import Badge from './Badge';
import CopyButton from './CopyButton';
import { getShortUrl } from '../lib/shortUrl';

export default function LinkCard({ link, onDelete }) {
  const shortUrl = getShortUrl(link.short_code);
  const status =
    !link.is_active
      ? { label: 'Disabled', variant: 'danger' }
      : link.is_expired
      ? { label: 'Expired', variant: 'warning' }
      : { label: 'Active', variant: 'success' };

  return (
    <div className="card p-3.5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:underline truncate"
          >
            /{link.short_code}
          </a>
          <CopyButton text={shortUrl} label="" />
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <div className="text-2xs text-ink-muted truncate mb-3">{link.original_url}</div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-ink-secondary">
          <span className="font-semibold text-ink-primary">{link.click_count}</span> clicks
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-border">
        <Link
          to={`/analytics/${link.id}`}
          className="btn btn-outline btn-sm justify-center"
        >
          <BarChart3 className="w-3.5 h-3.5" />
        </Link>
        <Link
          to={`/link-details/${link.id}`}
          className="btn btn-outline btn-sm justify-center"
        >
          <FileText className="w-3.5 h-3.5" />
        </Link>
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline btn-sm justify-center"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => onDelete(link.id)}
          className="btn btn-danger-outline btn-sm justify-center"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
