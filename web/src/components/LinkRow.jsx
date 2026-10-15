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
      aria-label={copied ? 'Copied' : 'Copy URL'}
      className={`w-6 h-6 inline-flex items-center justify-center rounded-md transition-colors duration-100 ${
        copied
          ? 'text-success bg-success-light'
          : 'text-ink-muted hover:bg-surface-hover hover:text-ink-primary'
      }`}
    >
      {copied ? <Check className="w-3 h-3" strokeWidth={2.5} /> : <Copy className="w-3 h-3" strokeWidth={2} />}
    </button>
  );
}

function ActionButton({ to, href, onClick, icon: Icon, label, danger = false }) {
  const base =
    'inline-flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium whitespace-nowrap border transition-colors duration-100';
  const styles = danger
    ? 'text-ink-secondary bg-white border-border hover:bg-danger-light hover:text-danger hover:border-danger/30'
    : 'text-ink-secondary bg-white border-border hover:bg-primary-light hover:text-primary hover:border-primary/30';

  const content = (
    <>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={1.75} />
      <span>{label}</span>
    </>
  );

  if (to) return <Link to={to} className={`${base} ${styles}`}>{content}</Link>;
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={`${base} ${styles}`}>{content}</a>;
  return <button type="button" onClick={onClick} className={`${base} ${styles}`}>{content}</button>;
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

export default function LinkRow({ link, onDelete }) {
  const shortUrl = getShortUrl(link.short_code);

  return (
    <tr className="border-b border-border last:border-0 hover:bg-surface-hover/60 transition-colors duration-100">
      {/* Link — takes remaining space */}
      <td className="py-3.5 pl-5 pr-3 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
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
        <div className="text-xs text-ink-muted truncate mt-1" title={link.original_url}>
          {link.original_url}
        </div>
      </td>

      {/* Status — fixed narrow */}
      <td className="py-3.5 px-3 w-[110px]">
        <StatusLabel link={link} />
      </td>

      {/* Clicks — fixed narrow */}
      <td className="py-3.5 px-3 w-[80px]">
        <span className="text-sm font-medium text-ink-primary tabular-nums">{link.click_count}</span>
      </td>

      {/* Actions — auto-shrinks to fit buttons, LEFT-aligned */}
      <td className="py-3.5 pl-3 pr-5 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <ActionButton to={`/analytics/${link.id}`} icon={BarChart3} label="Analytics" />
          <ActionButton to={`/link-details/${link.id}`} icon={FileText} label="Details" />
          <ActionButton href={shortUrl} icon={ExternalLink} label="Open" />
          <ActionButton onClick={() => onDelete(link.id)} icon={Trash2} label="Delete" danger />
        </div>
      </td>
    </tr>
  );
}
