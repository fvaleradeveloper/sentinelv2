'use client';

import { useParams } from 'next/navigation';
import { useCondominio } from '@/lib/hooks/useCondominio';
import Card, { CardHeader } from '@/components/ui/Card';
import ThemeSelector from '@/components/ui/ThemeSelector';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function ConfiguracionPage() {
  const params = useParams();
  const condominioId = params.condominioId as string;
  const { data: condominio } = useCondominio(condominioId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Configuración</h1>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader titulo="Datos del condominio" subtitulo="Información general" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-on-surface-muted">Nombre:</span> <span className="font-medium">{condominio?.nombre}</span></div>
            <div><span className="text-on-surface-muted">Dirección:</span> <span className="font-medium">{condominio?.direccion || '-'}</span></div>
            <div><span className="text-on-surface-muted">Moneda:</span> <span className="font-medium">{condominio?.simbolo_moneda}</span></div>
            <div><span className="text-on-surface-muted">Fondo reserva:</span> <span className="font-medium">{condominio?.fondo_reserva_porcentaje}%</span></div>
          </div>
        </Card>

        <Card>
          <CardHeader titulo="Apariencia" subtitulo="Personaliza la interfaz" />
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-on-surface mb-2 block">Modo oscuro</label>
              <ThemeToggle />
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface mb-2 block">Paleta de colores</label>
              <ThemeSelector />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}