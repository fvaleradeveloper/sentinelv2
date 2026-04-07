'use client';

import { Check } from 'lucide-react';
import { PLANES } from '@/lib/constants/planes';
import Button from '@/components/ui/Button';

export default function PlanesPage() {
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-on-surface">Planes y Precios</h1>
        <p className="text-on-surface-muted mt-2">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {PLANES.map((plan) => (
          <div
            key={plan.slug}
            className={`rounded-xl border bg-surface p-6 flex flex-col ${
              'destacado' in plan && plan.destacado
                ? 'border-primary shadow-lg ring-2 ring-primary/20'
                : 'border-border shadow-sm'
            }`}
          >
            {'destacado' in plan && plan.destacado && (
              <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4 self-start">
                Más popular
              </span>
            )}
            <h3 className="text-lg font-bold text-on-surface">{plan.nombre}</h3>
            <div className="mt-4 mb-6">
              <span className="text-3xl font-bold text-on-surface">S/ {plan.precioMensual.toFixed(2)}</span>
              <span className="text-sm text-on-surface-muted"> /mes</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.caracteristicas.map((car) => (
                <li key={car} className="flex items-start gap-2 text-sm text-on-surface">
                  <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                  {car}
                </li>
              ))}
            </ul>
            <Button
              variante={'destacado' in plan && plan.destacado ? 'primary' : 'outline'}
              className="w-full"
            >
              Seleccionar plan
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}