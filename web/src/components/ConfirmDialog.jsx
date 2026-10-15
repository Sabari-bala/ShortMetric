import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open, title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  onConfirm, onCancel, loading = false,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-primary/40 backdrop-blur-sm p-4"
      onClick={loading ? undefined : onCancel}
    >
      <div className="card w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-danger-light flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-danger" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-ink-primary">{title}</h3>
            <p className="text-xs text-ink-secondary mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="btn btn-outline btn-sm" disabled={loading}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="btn btn-danger btn-sm" disabled={loading}>
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
