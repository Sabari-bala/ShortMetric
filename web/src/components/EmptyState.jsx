import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'Nothing here yet',
  description,
  actionLabel,
  actionTo,
  onAction,
  icon: Icon = Inbox,
}) {
  return (
    <div className="card border-dashed py-12 text-center">
      <div className="flex justify-center mb-3">
        <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center">
          <Icon className="w-4 h-4 text-ink-muted" strokeWidth={1.75} />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-ink-primary mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-ink-muted max-w-sm mx-auto mb-5 px-4">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary btn-sm inline-flex">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button onClick={onAction} className="btn btn-primary btn-sm inline-flex">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
