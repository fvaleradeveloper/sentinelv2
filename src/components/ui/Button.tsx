'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variante = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Tamanio = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  tamanio?: Tamanio;
  cargando?: boolean;
}

const estilosVariante: Record<Variante, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-dark shadow-sm',
  secondary: 'bg-surface-alt text-on-surface hover:bg-border',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  ghost: 'text-on-surface hover:bg-surface-alt',
  outline: 'border border-border text-on-surface hover:bg-surface-alt',
};

const estilosTamanio: Record<Tamanio, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variante = 'primary', tamanio = 'md', cargando, children, disabled, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || cargando}
        className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed ${estilosVariante[variante]} ${estilosTamanio[tamanio]} ${className}`}
        {...props}
      >
        {cargando && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;