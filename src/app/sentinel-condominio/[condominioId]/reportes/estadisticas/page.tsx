'use client';

import Card, { CardHeader } from '@/components/ui/Card';
import TendenciaChart from '@/components/charts/TendenciaChart';

export default function EstadisticasPage() {
  const datosIngreso = [
    { etiqueta: 'Ene', valor: 5000 }, { etiqueta: 'Feb', valor: 4800 },
    { etiqueta: 'Mar', valor: 5200 }, { etiqueta: 'Abr', valor: 4600 },
    { etiqueta: 'May', valor: 5100 }, { etiqueta: 'Jun', valor: 5500 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Estadísticas</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader titulo="Tendencia de ingresos" />
          <TendenciaChart datos={datosIngreso} titulo="Ingresos" color="#22c55e" />
        </Card>
        <Card>
          <CardHeader titulo="Tendencia de egresos" />
          <TendenciaChart datos={datosIngreso.map((d) => ({ ...d, valor: d.valor * 0.65 }))} titulo="Egresos" color="#ef4444" />
        </Card>
      </div>
    </div>
  );
}