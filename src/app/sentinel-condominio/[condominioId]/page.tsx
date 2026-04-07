'use client';

import { useParams, useRouter } from 'next/navigation';
import { Building2, Users, DollarSign, FileText, Calculator, MessageCircle } from 'lucide-react';
import { useCondominio } from '@/lib/hooks/useCondominio';
import { CardKPI } from '@/components/ui/Card';
import Card from '@/components/ui/Card';

export default function CondominioDashboard() {
  const params = useParams();
  const router = useRouter();
  const condominioId = params.condominioId as string;
  const { data: condominio, isLoading } = useCondominio(condominioId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 skeleton" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 skeleton rounded-xl" />)}
        </div>
      </div>
    );
  }

  const basePath = `/sentinel-condominio/${condominioId}`;

  const accesosRapidos = [
    { etiqueta: 'Unidades', href: `${basePath}/unidades`, icono: <Building2 size={24} />, color: 'bg-blue-500' },
    { etiqueta: 'Personal', href: `${basePath}/personal`, icono: <Users size={24} />, color: 'bg-green-500' },
    { etiqueta: 'Ingresos', href: `${basePath}/finanzas/ingresos`, icono: <DollarSign size={24} />, color: 'bg-emerald-500' },
    { etiqueta: 'Egresos', href: `${basePath}/finanzas/egresos`, icono: <DollarSign size={24} />, color: 'bg-red-500' },
    { etiqueta: 'Reportes', href: `${basePath}/reportes/balance`, icono: <FileText size={24} />, color: 'bg-purple-500' },
    { etiqueta: 'Nómina', href: `${basePath}/nomina`, icono: <Calculator size={24} />, color: 'bg-orange-500' },
    { etiqueta: 'Chat', href: `${basePath}/chat`, icono: <MessageCircle size={24} />, color: 'bg-cyan-500' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">{condominio?.nombre}</h1>
        <p className="text-sm text-on-surface-muted">{condominio?.direccion || 'Dashboard del condominio'}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <CardKPI titulo="Unidades" valor="0" icono={<Building2 size={20} />} />
        <CardKPI titulo="Personal activo" valor="0" icono={<Users size={20} />} />
        <CardKPI titulo="Ingresos del mes" valor="S/ 0.00" icono={<DollarSign size={20} />} />
        <CardKPI titulo="Egresos del mes" valor="S/ 0.00" icono={<DollarSign size={20} />} />
      </div>

      {/* Accesos rápidos */}
      <h2 className="text-lg font-semibold text-on-surface mb-4">Accesos rápidos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {accesosRapidos.map((item) => (
          <Card
            key={item.etiqueta}
            onClick={() => router.push(item.href)}
            className="flex flex-col items-center gap-3 py-6 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${item.color}`}>
              {item.icono}
            </div>
            <span className="text-sm font-medium text-on-surface">{item.etiqueta}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}