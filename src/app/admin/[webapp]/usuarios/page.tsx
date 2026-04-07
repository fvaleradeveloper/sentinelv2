'use client';

import Card, { CardHeader } from '@/components/ui/Card';

export default function AdminUsuariosPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface mb-6">Gestión de usuarios</h1>
      <Card>
        <CardHeader titulo="Usuarios registrados" subtitulo="Lista de todos los usuarios del sistema" />
        <p className="text-sm text-on-surface-muted">Conecta con Supabase para ver los usuarios registrados.</p>
      </Card>
    </div>
  );
}