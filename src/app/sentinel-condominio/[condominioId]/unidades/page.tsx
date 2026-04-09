'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Unidad } from '@/lib/types/database';
import type { UnidadInput } from '@/lib/utils/validators';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import UnidadForm from '@/components/forms/UnidadForm';

export default function UnidadesPage() {
  const params = useParams();
  const condominioId = params.condominioId as string;
  const [modalAbierto, setModalAbierto] = useState(false);
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: unidades = [], isLoading } = useQuery({
    queryKey: ['unidades', condominioId],
    queryFn: async (): Promise<Unidad[]> => {
      const { data, error } = await supabase
        .from('unidades')
        .select('*')
        .eq('condominio_id', condominioId)
        .order('numero');
      if (error) throw error;
      return data;
    },
  });

  const crearMutation = useMutation({
    mutationFn: async (datos: UnidadInput) => {
      const { data, error } = await supabase
        .from('unidades')
        .insert({ ...datos, condominio_id: condominioId })
        .select()
        .single();
      if (error) {
        console.error('Error de Supabase:', error);
        throw new Error(`Error de base de datos: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades', condominioId] });
      toast.success('Unidad creada exitosamente');
      setModalAbierto(false);
    },
    onError: (error) => {
      console.error('Error al crear unidad:', error);
      toast.error(`Error al crear la unidad: ${error.message}`);
    },
  });

  const columnas = [
    { key: 'numero', titulo: 'Número' },
    { key: 'propietario', titulo: 'Propietario' },
    { key: 'email_propietario', titulo: 'Email' },
    { key: 'alicuota', titulo: 'Alícuota (%)', render: (u: Unidad) => `${u.alicuota}%` },
    {
      key: 'activo',
      titulo: 'Estado',
      render: (u: Unidad) => (
        <Badge variante={u.activo ? 'success' : 'danger'}>
          {u.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Unidades</h1>
          <p className="text-sm text-on-surface-muted">{unidades.length} unidades registradas</p>
        </div>
        <Button onClick={() => setModalAbierto(true)}>
          <Plus size={18} /> Nueva unidad
        </Button>
      </div>

      <Table
        columnas={columnas}
        datos={unidades}
        keyExtractor={(u) => String(u.id)}
        cargando={isLoading}
        vacio="No hay unidades registradas"
      />

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} titulo="Nueva unidad">
        <UnidadForm onSubmit={async (d) => crearMutation.mutateAsync(d)} cargando={crearMutation.isPending} />
      </Modal>
    </div>
  );
}