import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ label, error, helper, id, className = '', type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={className}>
      {label && <label htmlFor={id} className="label">{label}</label>}
      <div className="relative">
        <input
          id={id}
          type={actualType}
          className={`input ${isPassword ? 'pr-10' : ''} ${
            error ? 'border-danger focus:border-danger focus:ring-danger/15' : ''
          }`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded-md text-ink-muted hover:text-ink-primary hover:bg-surface-hover transition-colors"
            tabIndex={-1}
          >
            {showPassword
              ? <EyeOff className="w-4 h-4" strokeWidth={1.75} />
              : <Eye className="w-4 h-4" strokeWidth={1.75} />}
          </button>
        )}
      </div>
      {helper && !error && <p className="helper">{helper}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
