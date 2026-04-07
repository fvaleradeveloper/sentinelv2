'use client';

import { useParams } from 'next/navigation';
import Card, { CardHeader } from '@/components/ui/Card';
import BalanceChart from '@/components/charts/BalanceChart';

export default function BalancePage() {
  const params = useParams();

  const datosMock = [
    { mes: 'Ene', ingresos: 5000, egresos: 3200 },
    { mes: 'Feb', ingresos: 4800, egresos: 3500 },
    { mes: 'Mar', ingresos: 5200, egresos: 2900 },
    { mes: 'Abr', ingresos: 4600, egresos: 3800 },
    { mes: 'May', ingresos: 5100, egresos: 3100 },
    { mes: 'Jun', ingresos: 5500, egresos: 3400 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Balance financiero</h1>
      <Card>
        <CardHeader titulo="Ingresos vs Egresos" subtitulo="Ãšltimos 6 meses" />
        <BalanceChart datos={datosMock} />
      </Card>
    </div>
  );
}