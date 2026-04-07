'use client';

import Card, { CardHeader } from '@/components/ui/Card';

export default function AdminSuscripcionesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Suscripciones</h1>
      <Card>
        <CardHeader titulo="Todas las suscripciones" subtitulo="Administra planes y pagos" />
        <p className="text-sm text-on-surface-muted">Conecta con Supabase para gestionar suscripciones.</p>
      </Card>
    </div>
  );
}