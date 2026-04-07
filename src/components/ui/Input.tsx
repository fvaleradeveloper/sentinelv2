'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-on-surface mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 rounded-lg border bg-surface text-on-surface placeholder:text-on-surface-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
            error ? 'border-red-500 focus:ring-red-500/50' : 'border-border'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {helper && !error && <p className="text-xs text-on-surface-muted mt-1">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;