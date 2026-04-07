'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Personal } from '@/lib/types/database';
import type { PersonalInput } from '@/lib/utils/validators';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import PersonalForm from '@/components/forms/PersonalForm';
import { formatMoneda } from '@/lib/utils/format';

export default function PersonalPage() {
  const params = useParams();
  const router = useRouter();
  const condominioId = params.condominioId as string;
  const [modalAbierto, setModalAbierto] = useState(false);
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: personal = [], isLoading } = useQuery({
    queryKey: ['personal', condominioId],
    queryFn: async (): Promise<Personal[]> => {
      const { data, error } = await supabase
        .from('personal')
        .select('*')
        .eq('condominio_id', condominioId)
        .order('nombre');
      if (error) throw error;
      return data;
    },
  });

  const crearMutation = useMutation({
    mutationFn: async (datos: PersonalInput) => {
      const { error } = await supabase.from('personal').insert({ ...datos, condominio_id: condominioId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal', condominioId] });
      toast.success('Personal registrado');
      setModalAbierto(false);
    },
    onError: () => toast.error('Error al registrar personal'),
  });

  const columnas = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'cargo', titulo: 'Cargo' },
    { key: 'documento_identidad', titulo: 'Documento' },
    { key: 'salario', titulo: 'Salario', render: (p: Personal) => formatMoneda(p.salario ?? 0) },
    { key: 'regimen_pensionario', titulo: 'Régimen' },
    {
      key: 'activo',
      titulo: 'Estado',
      render: (p: Personal) => (
        <Badge variante={p.activo ? 'success' : 'danger'}>
          {p.activo ? 'Activo' : 'Cesado'}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Personal</h1>
          <p className="text-sm text-on-surface-muted">{personal.length} empleados</p>
        </div>
        <Button onClick={() => setModalAbierto(true)}>
          <Plus size={18} /> Nuevo personal
        </Button>
      </div>

      <Table
        columnas={columnas}
        datos={personal as unknown as Record<string, unknown>[]}
        keyExtractor={(p) => String(p.id)}
        cargando={isLoading}
        vacio="No hay personal registrado"
        onClickFila={(p) => router.push(`/sentinel-condominio/${condominioId}/personal/${p.id}`)}
      />

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} titulo="Registrar personal" ancho="lg">
        <PersonalForm onSubmit={async (d) => crearMutation.mutateAsync(d)} cargando={crearMutation.isPending} />
      </Modal>
    </div>
  );
}