import { Link } from 'react-router-dom';
import { BarChart3, FileText, Trash2, ExternalLink } from 'lucide-react';
import Badge from './Badge';
import CopyButton from './CopyButton';
import { getShortUrl } from '../lib/shortUrl';

function ActionButton({ as: Component, to, href, onClick, icon: Icon, label, variant = 'default' }) {
  const baseClasses = `relative group/btn w-8 h-8 inline-flex items-center justify-center rounded-md transition-colors`;
  const variants = {
    default: 'text-ink-muted hover:bg-primary-light hover:text-primary',
    danger:  'text-ink-muted hover:bg-danger-light hover:text-danger',
  };

  const props = {
    className: `${baseClasses} ${variants[variant]}`,
    'aria-label': label,
  };

  const content = (
    <>
      <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-ink-primary text-white text-2xs font-medium whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity duration-150 z-10">
        {label}
      </span>
    </>
  );

  if (Component === Link) return <Link to={to} {...props}>{content}</Link>;
  if (Component === 'a') return <a href={href} target="_blank" rel="noreferrer" {...props}>{content}</a>;
  return <button onClick={onClick} type="button" {...props}>{content}</button>;
}

export default function LinkRow({ link, onDelete }) {
  const shortUrl = getShortUrl(link.short_code);
  const status =
    !link.is_active
      ? { label: 'Disabled', variant: 'danger' }
      : link.is_expired
      ? { label: 'Expired', variant: 'warning' }
      : { label: 'Active', variant: 'success' };

  return (
    <tr className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors duration-100">
      <td className="px-4 py-3 max-w-[320px]">
        <div className="flex items-center gap-2 min-w-0">
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[13px] font-medium text-primary hover:underline truncate"
          >
            /{link.short_code}
          </a>
          <CopyButton text={shortUrl} label="" />
        </div>
        <div className="text-2xs text-ink-muted truncate mt-0.5" title={link.original_url}>
          {link.original_url}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={status.variant}>{status.label}</Badge>
      </td>
      <td className="px-4 py-3 text-[13px] font-medium text-ink-primary tabular-nums">
        {link.click_count}
      </td>
      <td className="px-4 py-3">
        <div className="inline-flex items-center gap-1">
          <ActionButton as={Link} to={`/analytics/${link.id}`} icon={BarChart3} label="Analytics" />
          <ActionButton as={Link} to={`/link-details/${link.id}`} icon={FileText} label="Details" />
          <ActionButton as="a" href={shortUrl} icon={ExternalLink} label="Open link" />
          <ActionButton onClick={() => onDelete(link.id)} icon={Trash2} label="Delete" variant="danger" />
        </div>
      </td>
    </tr>
  );
}
