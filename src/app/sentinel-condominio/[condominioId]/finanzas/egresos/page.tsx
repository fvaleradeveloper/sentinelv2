'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Movimiento } from '@/lib/types/database';
import type { MovimientoInput } from '@/lib/utils/validators';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import GastoForm from '@/components/forms/GastoForm';
import { formatMoneda, formatFecha } from '@/lib/utils/format';

export default function EgresosPage() {
  const params = useParams();
  const condominioId = params.condominioId as string;
  const [modalAbierto, setModalAbierto] = useState(false);
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: egresos = [], isLoading } = useQuery({
    queryKey: ['egresos', condominioId],
    queryFn: async (): Promise<Movimiento[]> => {
      const { data, error } = await supabase
        .from('movimientos')
        .select('*')
        .eq('condominio_id', condominioId)
        .eq('tipo', 'egreso')
        .order('fecha', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const crearMutation = useMutation({
    mutationFn: async (datos: MovimientoInput) => {
      const { error } = await supabase.from('movimientos').insert({ ...datos, condominio_id: condominioId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['egresos', condominioId] });
      toast.success('Egreso registrado');
      setModalAbierto(false);
    },
    onError: () => toast.error('Error al registrar egreso'),
  });

  const columnas = [
    { key: 'fecha', titulo: 'Fecha', render: (m: Movimiento) => formatFecha(m.fecha) },
    { key: 'categoria', titulo: 'Categoría' },
    { key: 'descripcion', titulo: 'Descripción' },
    { key: 'monto', titulo: 'Monto', render: (m: Movimiento) => formatMoneda(m.monto) },
    { key: 'tipo_comprobante', titulo: 'Comprobante' },
  ];

  const total = egresos.reduce((sum, e) => sum + e.monto, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Egresos</h1>
          <p className="text-sm text-on-surface-muted">Total: {formatMoneda(total)}</p>
        </div>
        <Button onClick={() => setModalAbierto(true)}>
          <Plus size={18} /> Nuevo egreso
        </Button>
      </div>

      <Table
        columnas={columnas}
        datos={egresos as unknown as Record<string, unknown>[]}
        keyExtractor={(m) => String(m.id)}
        cargando={isLoading}
        vacio="No hay egresos registrados"
      />

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} titulo="Registrar egreso">
        <GastoForm onSubmit={async (d) => crearMutation.mutateAsync(d)} cargando={crearMutation.isPending} />
      </Modal>
    </div>
  );
}