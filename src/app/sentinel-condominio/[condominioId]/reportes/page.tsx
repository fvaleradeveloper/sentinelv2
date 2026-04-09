'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, FileText, TrendingUp, Receipt } from 'lucide-react';
import Card from '@/components/ui/Card';

const accesosRapidos = [
  {
    etiqueta: 'Gráficas de Balance',
    descripcion: 'Visualiza ingresos y egresos del condominio',
    href: 'balance',
    icono: <BarChart3 size={32} />,
    color: 'bg-blue-500'
  },
  {
    etiqueta: 'Recibos de Ingreso',
    descripcion: 'Envía recibos por email a propietarios',
    href: 'recibos',
    icono: <Receipt size={32} />,
    color: 'bg-green-500'
  },
  {
    etiqueta: 'Estadísticas',
    descripcion: 'Métricas y análisis del condominio',
    href: 'estadisticas',
    icono: <TrendingUp size={32} />,
    color: 'bg-purple-500'
  },
  {
    etiqueta: 'Reporte de Deudas',
    descripcion: 'Control de cuotas pendientes',
    href: 'deudas',
    icono: <FileText size={32} />,
    color: 'bg-orange-500'
  }
];

export default function ReportesPage() {
  const params = useParams();
  const condominioId = params.condominioId as string;
  const basePath = `/sentinel-condominio/${condominioId}/reportes`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Centro de Reportes</h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Accede a todos los reportes y análisis de tu condominio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {accesosRapidos.map((item) => (
          <Link key={item.etiqueta} href={`${basePath}/${item.href}`}>
            <Card className="h-full p-6 hover:bg-surface-alt transition-colors group">
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform`}>
                  {item.icono}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-on-surface text-lg mb-2">
                    {item.etiqueta}
                  </h3>
                  <p className="text-sm text-on-surface-muted">
                    {item.descripcion}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 bg-surface-alt rounded-xl border">
        <h3 className="font-semibold text-on-surface mb-3">¿Qué puedes hacer aquí?</h3>
        <ul className="text-sm text-on-surface-muted space-y-2">
          <li>• <strong>Gráficas de Balance:</strong> Visualiza el balance entre ingresos y egresos mensuales</li>
          <li>• <strong>Recibos de Ingreso:</strong> Genera y envía recibos por email cuando los propietarios cancelan sus cuotas</li>
          <li>• <strong>Comprobantes de Pago:</strong> Imprime o guarda comprobantes para servicios, sueldos y otros gastos</li>
          <li>• <strong>Estadísticas:</strong> Analiza métricas clave del condominio</li>
          <li>• <strong>Control de Deudas:</strong> Gestiona y monitorea cuotas pendientes</li>
        </ul>
      </div>
    </div>
  );
}