import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  titulo: string;
  subtitulo?: string;
  accion?: ReactNode;
}

export function CardHeader({ titulo, subtitulo, accion }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-on-surface">{titulo}</h3>
        {subtitulo && <p className="text-sm text-on-surface-muted mt-0.5">{subtitulo}</p>}
      </div>
      {accion && <div>{accion}</div>}
    </div>
  );
}

interface CardKPIProps {
  titulo: string;
  valor: string | number;
  icono?: ReactNode;
  tendencia?: { valor: number; positivo: boolean };
}

export function CardKPI({ titulo, valor, icono, tendencia }: CardKPIProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-on-surface-muted">{titulo}</span>
        {icono && <span className="text-primary">{icono}</span>}
      </div>
      <p className="text-2xl font-bold text-on-surface">{valor}</p>
      {tendencia && (
        <p className={`text-xs mt-1 ${tendencia.positivo ? 'text-green-600' : 'text-red-600'}`}>
          {tendencia.positivo ? 'â†‘' : 'â†“'} {Math.abs(tendencia.valor)}% vs mes anterior
        </p>
      )}
    </div>
  );
}