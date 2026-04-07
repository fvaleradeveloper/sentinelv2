'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Calculator } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import NominaForm from '@/components/forms/NominaForm';

export default function NominaPage() {
  const params = useParams();
  const router = useRouter();
  const condominioId = params.condominioId as string;
  const [modalAbierto, setModalAbierto] = useState(false);
  const supabase = createClient();

  const { data: meses = [] } = useQuery({
    queryKey: ['nominas-meses', condominioId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nominas')
        .select('mes')
        .eq('condominio_id', condominioId)
        .order('mes', { ascending: false });
      if (error) throw error;
      const uniqueMeses = [...new Set(data.map((n: { mes: string }) => n.mes))];
      return uniqueMeses;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Nómina</h1>
          <p className="text-sm text-on-surface-muted">Gestión de nóminas mensuales</p>
        </div>
        <Button onClick={() => setModalAbierto(true)}>
          <Calculator size={18} /> Generar nómina
        </Button>
      </div>

      {meses.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {meses.map((mes) => (
            <Card key={mes} onClick={() => router.push(`/sentinel-condominio/${condominioId}/nomina/${mes}`)} className="cursor-pointer text-center py-6">
              <p className="text-lg font-semibold text-on-surface">{mes}</p>
              <p className="text-xs text-on-surface-muted mt-1">Ver detalle</p>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Calculator className="mx-auto text-on-surface-muted mb-4" size={48} />
          <p className="text-on-surface-muted">No hay nóminas generadas aún</p>
        </Card>
      )}

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} titulo="Generar nómina">
        <NominaForm onSubmit={async (datos) => { console.log(datos); setModalAbierto(false); }} />
      </Modal>
    </div>
  );
}