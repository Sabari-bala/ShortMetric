import { AlertCircle } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="card py-10 text-center">
      <div className="flex justify-center mb-3">
        <div className="w-10 h-10 rounded-full bg-danger-light flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-danger" strokeWidth={2} />
        </div>
      </div>
      <p className="text-sm text-ink-secondary mb-4 px-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline btn-sm">
          Try again
        </button>
      )}
    </div>
  );
}
