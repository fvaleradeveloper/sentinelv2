'use client';

import Card, { CardHeader } from '@/components/ui/Card';

export default function AdminLogsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Logs de acceso</h1>
      <Card>
        <CardHeader titulo="Registro de actividad" subtitulo="Monitoreo de accesos y acciones" />
        <p className="text-sm text-on-surface-muted">Conecta con Supabase para ver los logs de acceso.</p>
      </Card>
    </div>
  );
}