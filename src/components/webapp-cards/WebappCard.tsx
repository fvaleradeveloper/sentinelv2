import Link from 'next/link';
import type { WebappManifest } from '@/lib/types/webapp';

interface WebappCardProps {
  webapp: WebappManifest;
  suscrito: boolean;
}

export default function WebappCard({ webapp, suscrito }: WebappCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm hover:shadow-md transition-all group">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-105 transition-transform"
        style={{ backgroundColor: webapp.color }}
      >
        {webapp.icono}
      </div>
      <h3 className="text-lg font-semibold text-on-surface mb-1">{webapp.nombre}</h3>
      <p className="text-sm text-on-surface-muted mb-4 line-clamp-2">{webapp.descripcion}</p>

      {webapp.activo ? (
        suscrito ? (
          <Link
            href={webapp.ruta}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-on-primary hover:bg-primary-dark transition-colors"
          >
            Entrar
          </Link>
        ) : (
          <Link
            href="/sentinel-condominio/planes"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors"
          >
            Suscribirse
          </Link>
        )
      ) : (
        <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-surface-alt text-on-surface-muted">
          Próximamente
        </span>
      )}
    </div>
  );
}