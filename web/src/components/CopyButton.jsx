import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ text, className = '', label = 'Copy' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert('Copy failed. Please copy manually.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied' : 'Copy'}
      className={`inline-flex items-center gap-1 h-6 px-1.5 rounded text-2xs font-medium transition-colors duration-100 ${
        copied
          ? 'bg-success-light text-success'
          : 'text-ink-muted hover:bg-surface-hover hover:text-ink-primary'
      } ${className}`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : label}
    </button>
  );
}
