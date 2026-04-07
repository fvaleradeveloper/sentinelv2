'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, Pin } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import type { Mensaje } from '@/lib/types/database';
import type { MensajeInput } from '@/lib/utils/validators';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import MensajeForm from '@/components/forms/MensajeForm';

export default function ChatPage() {
  const params = useParams();
  const condominioId = params.condominioId as string;
  const [modalAbierto, setModalAbierto] = useState(false);
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: mensajes = [], isLoading } = useQuery({
    queryKey: ['mensajes', condominioId],
    queryFn: async (): Promise<Mensaje[]> => {
      const { data, error } = await supabase
        .from('mensajes')
        .select('*, autor:perfiles(nombre_completo, username)')
        .eq('condominio_id', condominioId)
        .eq('visible', true)
        .order('fijado', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const crearMutation = useMutation({
    mutationFn: async (datos: MensajeInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');
      const { error } = await supabase.from('mensajes').insert({
        ...datos,
        condominio_id: condominioId,
        autor_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mensajes', condominioId] });
      toast.success('Mensaje publicado');
      setModalAbierto(false);
    },
    onError: () => toast.error('Error al enviar mensaje'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Tablero de mensajes</h1>
          <p className="text-sm text-on-surface-muted">{mensajes.length} mensajes</p>
        </div>
        <Button onClick={() => setModalAbierto(true)}>
          <MessageCircle size={18} /> Nuevo mensaje
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-24 skeleton rounded-xl" />)
        ) : mensajes.length === 0 ? (
          <Card className="text-center py-12">
            <MessageCircle className="mx-auto text-on-surface-muted mb-4" size={48} />
            <p className="text-on-surface-muted">No hay mensajes aún</p>
          </Card>
        ) : (
          mensajes.map((msg) => (
            <Card key={msg.id}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variante="info">{msg.tipo}</Badge>
                  {msg.fijado && <Pin size={14} className="text-primary" />}
                </div>
                <span className="text-xs text-on-surface-muted">
                  {new Date(msg.created_at).toLocaleDateString('es-PE')}
                </span>
              </div>
              <h3 className="font-semibold text-on-surface">{msg.titulo}</h3>
              <p className="text-sm text-on-surface-muted mt-1">{msg.contenido}</p>
              <p className="text-xs text-on-surface-muted mt-3">
                Por: {msg.autor?.nombre_completo || msg.autor?.username || 'Anónimo'}
              </p>
            </Card>
          ))
        )}
      </div>

      <Modal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} titulo="Nuevo mensaje" ancho="lg">
        <MensajeForm onSubmit={async (d) => crearMutation.mutateAsync(d)} cargando={crearMutation.isPending} />
      </Modal>
    </div>
  );
}