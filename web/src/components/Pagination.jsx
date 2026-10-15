import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, hasNext, hasPrev, onPrev, onNext }) {
  if (!hasNext && !hasPrev) return null;

  return (
    <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-border">
      <div className="text-xs text-ink-muted">Page {page}</div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="btn btn-outline btn-sm"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="btn btn-outline btn-sm"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
