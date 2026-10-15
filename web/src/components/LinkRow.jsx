import { Link } from 'react-router-dom';
import { BarChart3, FileText, Trash2, ExternalLink } from 'lucide-react';
import CopyButton from './CopyButton';
import { getShortUrl } from '../lib/shortUrl';

function ActionLink({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium
                 text-ink-secondary bg-white border border-border
                 hover:bg-primary-light hover:text-primary hover:border-primary/30
                 transition-colors duration-100 whitespace-nowrap"
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
      <span>{label}</span>
    </Link>
  );
}

function ActionIcon({ href, onClick, icon: Icon, label, danger = false }) {
  const base = `relative group/act inline-flex items-center justify-center w-7 h-7 rounded-md
                bg-white border border-border transition-colors duration-100`;
  const styles = danger
    ? 'text-ink-muted hover:bg-danger-light hover:text-danger hover:border-danger/30'
    : 'text-ink-muted hover:bg-surface-hover hover:text-ink-primary hover:border-border-strong';

  const content = (
    <>
      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2
                       px-2 py-1 rounded-md bg-ink-primary text-white text-2xs font-medium
                       whitespace-nowrap opacity-0 group-hover/act:opacity-100
                       transition-opacity duration-150 z-10">
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={`${base} ${styles}`} aria-label={label}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`} aria-label={label}>
      {content}
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
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
      <span className={status.text}>{status.label}</span>
    </span>
  );
}

export default function LinkRow({ link, onDelete }) {
  const shortUrl = getShortUrl(link.short_code);

  return (
    <tr className="border-b border-border last:border-0 hover:bg-surface-hover/60 transition-colors duration-100">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2 min-w-0">
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-primary hover:underline truncate"
          >
            /{link.short_code}
          </a>
          <CopyButton text={shortUrl} label="" />
        </div>
        <div className="text-xs text-ink-muted truncate mt-1" title={link.original_url}>
          {link.original_url}
        </div>
      </td>
      <td className="px-5 py-3.5">
        <StatusLabel link={link} />
      </td>
      <td className="px-5 py-3.5 text-sm font-medium text-ink-primary tabular-nums">
        {link.click_count}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          <ActionLink to={`/analytics/${link.id}`} icon={BarChart3} label="Analytics" />
          <ActionLink to={`/link-details/${link.id}`} icon={FileText} label="Details" />
          <ActionIcon href={shortUrl} icon={ExternalLink} label="Open link" />
          <ActionIcon onClick={() => onDelete(link.id)} icon={Trash2} label="Delete" danger />
        </div>
      </td>
    </tr>
  );
}
