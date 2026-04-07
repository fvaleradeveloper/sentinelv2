'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCondominios, useCrearCondominio } from '@/lib/hooks/useCondominio';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import CondominioForm from '@/components/forms/CondominioForm';
import type { CondominioInput } from '@/lib/utils/validators';

export default function DashboardPage() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const router = useRouter();
  const { data: condominios, isLoading } = useCondominios();
  const crearMutation = useCrearCondominio();

  const handleCrear = async (datos: CondominioInput) => {
    try {
      const nuevo = await crearMutation.mutateAsync(datos);
      toast.success('Condominio creado exitosamente');
      setModalAbierto(false);
      router.push(`/sentinel-condominio/${nuevo.id}`);
    } catch {
      toast.error('Error al crear el condominio');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 skeleton" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Mis Condominios</h1>
          <p className="text-sm text-on-surface-muted mt-1">Administra tus propiedades</p>
        </div>
        <Button onClick={() => setModalAbierto(true)}>
          <Plus size={18} />
          Nuevo condominio
        </Button>
      </div>

      {condominios && condominios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {condominios.map((c) => (
            <Card
              key={c.id}
              onClick={() => router.push(`/sentinel-condominio/${c.id}`)}
              className="cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Building2 className="text-primary" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-on-surface truncate">{c.nombre}</h3>
                  <p className="text-sm text-on-surface-muted truncate">{c.direccion || 'Sin dirección'}</p>
                  <p className="text-xs text-on-surface-muted mt-2">
                    {c.simbolo_moneda} Â· {c.ubicacion}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Building2 className="mx-auto text-on-surface-muted mb-4" size={48} />
          <h3 className="text-lg font-semibold text-on-surface mb-2">Sin condominios</h3>
          <p className="text-sm text-on-surface-muted mb-4">Crea tu primer condominio para empezar</p>
          <Button onClick={() => setModalAbierto(true)}>
            <Plus size={18} /> Crear condominio
          </Button>
        </Card>
      )}

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} titulo="Nuevo condominio">
        <CondominioForm onSubmit={handleCrear} cargando={crearMutation.isPending} />
      </Modal>
    </div>
  );
}