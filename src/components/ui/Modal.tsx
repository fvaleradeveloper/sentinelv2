'use client';

import { ReactNode, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo?: string;
  children: ReactNode;
  ancho?: 'sm' | 'md' | 'lg' | 'xl';
}

const anchosModal = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export default function Modal({ abierto, onCerrar, titulo, children, ancho = 'md' }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    },
    [onCerrar]
  );

  useEffect(() => {
    if (abierto) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [abierto, handleEscape]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCerrar} />
      <div className={`relative w-full ${anchosModal[ancho]} bg-surface rounded-xl shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200`}>
        {titulo && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-on-surface">{titulo}</h2>
            <button
              onClick={onCerrar}
              className="p-1 rounded-lg hover:bg-surface-alt text-on-surface-muted transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  abierto: boolean;
  onCerrar: () => void;
  onConfirmar: () => void;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  peligroso?: boolean;
}

export function ConfirmModal({
  abierto,
  onCerrar,
  onConfirmar,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  peligroso = false,
}: ConfirmModalProps) {
  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo={titulo} ancho="sm">
      <p className="text-sm text-on-surface-muted mb-6">{mensaje}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCerrar}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-border text-on-surface hover:bg-surface-alt transition-colors"
        >
          {textoCancelar}
        </button>
        <button
          onClick={() => { onConfirmar(); onCerrar(); }}
          className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors ${
            peligroso ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'
          }`}
        >
          {textoConfirmar}
        </button>
      </div>
    </Modal>
  );
}