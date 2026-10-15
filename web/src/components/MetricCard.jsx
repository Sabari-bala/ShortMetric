export default function MetricCard({ label, value, subtitle, icon: Icon, accent = 'default' }) {
  const accents = {
    default: 'text-ink-secondary bg-surface-muted',
    primary: 'text-primary bg-primary-light',
    success: 'text-success bg-success-light',
    warning: 'text-warning bg-warning-light',
    danger:  'text-danger bg-danger-light',
  };

  return (
    <div className="card card-hover p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="section-label">{label}</span>
        {Icon && (
          <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${accents[accent]}`}>
            <Icon className="w-3.5 h-3.5" strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="text-xl font-semibold text-ink-primary tracking-tight leading-none">
        {value}
      </div>
      {subtitle && (
        <div className="text-2xs text-ink-muted mt-1.5">{subtitle}</div>
      )}
    </div>
  );
}
