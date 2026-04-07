'use client';

import Card, { CardHeader } from '@/components/ui/Card';
import DeudasChart from '@/components/charts/DeudasChart';

export default function DeudasPage() {
  const datosMock = [
    { unidad: 'A-101', monto: 450 }, { unidad: 'B-203', monto: 900 },
    { unidad: 'C-102', monto: 200 }, { unidad: 'A-304', monto: 1200 },
    { unidad: 'D-101', monto: 350 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Deudas por unidad</h1>
      <Card>
        <CardHeader titulo="Top unidades deudoras" />
        <DeudasChart datos={datosMock} />
      </Card>
    </div>
  );
}