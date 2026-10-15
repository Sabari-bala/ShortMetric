export default function Badge({ children, variant = 'muted', className = '' }) {
  const variants = {
    success: 'badge-success',
    danger:  'badge-danger',
    warning: 'badge-warning',
    primary: 'badge-primary',
    muted:   'badge-muted',
  };
  return (
    <span className={`badge ${variants[variant]} ${className}`}>{children}</span>
  );
}
