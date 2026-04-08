'use client';

import { ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Columna<T = any> {
  key: string;
  titulo: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TableProps<T = any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnas: Columna<any>[];
  datos: T[];
  keyExtractor: (item: T) => string;
  vacio?: string;
  cargando?: boolean;
  onClickFila?: (item: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Table<T = any>({
  columnas,
  datos,
  keyExtractor,
  vacio = 'No hay datos para mostrar',
  cargando = false,
  onClickFila,
}: TableProps<T>) {
  if (cargando) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-on-surface-muted mt-3">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-alt border-b border-border">
              {columnas.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-on-surface-muted uppercase tracking-wider ${col.className || ''}`}
                >
                  {col.titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {datos.length === 0 ? (
              <tr>
                <td colSpan={columnas.length} className="px-4 py-8 text-center text-sm text-on-surface-muted">
                  {vacio}
                </td>
              </tr>
            ) : (
              datos.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onClickFila?.(item)}
                  className={`bg-surface transition-colors hover:bg-surface-alt ${onClickFila ? 'cursor-pointer' : ''}`}
                >
                  {columnas.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-sm text-on-surface ${col.className || ''}`}>
                      {col.render
                        ? col.render(item)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        : String((item as any)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}

export function Paginacion({ paginaActual, totalPaginas, onCambiarPagina }: PaginacionProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <p className="text-sm text-on-surface-muted">
        Página {paginaActual} de {totalPaginas}
      </p>
      <div className="flex gap-2">
        <button
          disabled={paginaActual <= 1}
          onClick={() => onCambiarPagina(paginaActual - 1)}
          className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        <button
          disabled={paginaActual >= totalPaginas}
          onClick={() => onCambiarPagina(paginaActual + 1)}
          className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-surface-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}