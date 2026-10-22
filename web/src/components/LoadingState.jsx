export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="card divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-3.5 flex items-center gap-4">
          <div className="skeleton h-3.5 w-28" />
          <div className="skeleton h-3.5 flex-1 max-w-md" />
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-3.5 w-10 ml-auto" />
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="card p-4">
          <div className="flex justify-between mb-3">
            <div className="skeleton h-2.5 w-20" />
            <div className="skeleton h-7 w-7 rounded-md" />
          </div>
          <div className="skeleton h-6 w-12" />
        </div>
      ))}
    </div>
  );
}

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2">
      <div className="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin" />
      <p className="text-xs text-ink-muted">{message}</p>
    </div>
  );
}
