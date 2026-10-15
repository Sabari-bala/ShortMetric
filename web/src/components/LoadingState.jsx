export function LoadingSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card p-4 flex items-center gap-4">
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="card p-4">
          <div className="skeleton h-3 w-20 mb-3" />
          <div className="skeleton h-7 w-12" />
        </div>
      ))}
    </div>
  );
}

export default function LoadingState({ message = 'Loading...', variant = 'spinner' }) {
  if (variant === 'skeleton') {
    return <LoadingSkeleton />;
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-7 h-7 border-2 border-border border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-ink-muted">{message}</p>
    </div>
  );
}
