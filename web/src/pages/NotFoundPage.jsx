import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl font-bold text-primary mb-3 tracking-tight">404</div>
        <h1 className="text-lg font-semibold text-ink-primary mb-2">Page not found</h1>
        <p className="text-sm text-ink-secondary mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <Link to="/" className="btn btn-primary btn-sm">
            <Home className="w-3.5 h-3.5" /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-outline btn-sm">
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
