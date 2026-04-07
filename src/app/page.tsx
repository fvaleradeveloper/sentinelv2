import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import type { WebappManifest } from '@/lib/types/webapp';

function getWebapps(): WebappManifest[] {
  const webappsDir = path.join(process.cwd(), 'webapps');
  const dirs = fs.readdirSync(webappsDir);
  const webapps: WebappManifest[] = [];

  for (const dir of dirs) {
    const manifestPath = path.join(webappsDir, dir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      const content = fs.readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(content) as WebappManifest;
      webapps.push(manifest);
    }
  }

  return webapps.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export default function HubPage() {
  const webapps = getWebapps();

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-primary text-on-primary">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">SENTINEL</h1>
              <p className="text-sm opacity-90 mt-1">Plataforma integral de gestión</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-primary hover:bg-white/90 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-on-surface mb-4">
          Gestiona tus propiedades de forma inteligente
        </h2>
        <p className="text-lg text-on-surface-muted max-w-2xl mx-auto">
          SENTINEL te ofrece herramientas profesionales para la administración
          de condominios, seguridad, contabilidad y más.
        </p>
      </section>

      {/* Webapps Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-semibold text-on-surface mb-8">Nuestras aplicaciones</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {webapps.map((webapp) => (
            <div
              key={webapp.slug}
              className="rounded-xl border border-border bg-surface p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4"
                style={{ backgroundColor: webapp.color }}
              >
                {webapp.icono}
              </div>
              <h4 className="text-lg font-semibold text-on-surface mb-2">{webapp.nombre}</h4>
              <p className="text-sm text-on-surface-muted mb-4">{webapp.descripcion}</p>
              {webapp.activo ? (
                <Link
                  href={webapp.ruta}
                  className="inline-block px-4 py-2 text-sm font-medium rounded-lg bg-primary text-on-primary hover:bg-primary-dark transition-colors"
                >
                  Entrar
                </Link>
              ) : (
                <span className="inline-block px-4 py-2 text-sm font-medium rounded-lg bg-surface-alt text-on-surface-muted cursor-not-allowed">
                  Próximamente
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-on-surface-muted">
          © {new Date().getFullYear()} SENTINEL. Todos los derechos reservados.
        </div>
      </footer>
    </main>
  );
}