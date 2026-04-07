'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Users, CreditCard, FileText, Shield } from 'lucide-react';
import Card, { CardKPI } from '@/components/ui/Card';

export default function AdminDashboardPage() {
  const params = useParams();
  const webapp = params.webapp as string;

  const enlaces = [
    { etiqueta: 'Usuarios', href: `/admin/${webapp}/usuarios`, icono: <Users size={24} /> },
    { etiqueta: 'Suscripciones', href: `/admin/${webapp}/suscripciones`, icono: <CreditCard size={24} /> },
    { etiqueta: 'Logs', href: `/admin/${webapp}/logs`, icono: <FileText size={24} /> },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Shield className="text-primary" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Panel de administración</h1>
          <p className="text-sm text-on-surface-muted">Webapp: {webapp}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <CardKPI titulo="Usuarios totales" valor="0" />
        <CardKPI titulo="Suscripciones activas" valor="0" />
        <CardKPI titulo="Ingresos del mes" valor="S/ 0.00" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {enlaces.map((item) => (
          <Link key={item.etiqueta} href={item.href}>
            <Card className="flex items-center gap-4 hover:bg-surface-alt transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                {item.icono}
              </div>
              <span className="font-medium text-on-surface">{item.etiqueta}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}