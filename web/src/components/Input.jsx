export default function Input({ label, error, helper, id, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="label">{label}</label>}
      <input
        id={id}
        className={`input ${error ? 'border-danger focus:border-danger focus:ring-danger/15' : ''}`}
        {...props}
      />
      {helper && !error && <p className="helper">{helper}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
