'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  FileText,
  Calculator,
  MessageCircle,
  Settings,
  ChevronLeft,
  CreditCard,
} from 'lucide-react';
import { useUIStore } from '@/lib/store/useUIStore';

interface ItemMenu {
  etiqueta: string;
  href: string;
  icono: React.ReactNode;
}

interface SidebarProps {
  condominioId?: string;
}

export default function Sidebar({ condominioId }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();

  const basePath = condominioId
    ? `/sentinel-condominio/${condominioId}`
    : '/sentinel-condominio';

  const menuItems: ItemMenu[] = condominioId
    ? [
        { etiqueta: 'Resumen', href: basePath, icono: <LayoutDashboard size={20} /> },
        { etiqueta: 'Unidades', href: `${basePath}/unidades`, icono: <Building2 size={20} /> },
        { etiqueta: 'Personal', href: `${basePath}/personal`, icono: <Users size={20} /> },
        { etiqueta: 'Ingresos', href: `${basePath}/finanzas/ingresos`, icono: <DollarSign size={20} /> },
        { etiqueta: 'Egresos', href: `${basePath}/finanzas/egresos`, icono: <DollarSign size={20} /> },
        { etiqueta: 'Reportes', href: `${basePath}/reportes/balance`, icono: <FileText size={20} /> },
        { etiqueta: 'Nómina', href: `${basePath}/nomina`, icono: <Calculator size={20} /> },
        { etiqueta: 'Chat', href: `${basePath}/chat`, icono: <MessageCircle size={20} /> },
        { etiqueta: 'Configuración', href: `${basePath}/configuracion`, icono: <Settings size={20} /> },
      ]
    : [
        { etiqueta: 'Mis Condominios', href: '/sentinel-condominio/dashboard', icono: <LayoutDashboard size={20} /> },
        { etiqueta: 'Planes', href: '/sentinel-condominio/planes', icono: <CreditCard size={20} /> },
      ];

  return (
    <>
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-surface border-r border-border transition-all duration-300 ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-16 lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Toggle desktop */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center h-10 mx-2 mt-2 rounded-lg hover:bg-surface-alt text-on-surface-muted transition-colors"
          >
            <ChevronLeft size={20} className={`transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {menuItems.map((item) => {
              const activo = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activo
                      ? 'bg-primary/10 text-primary'
                      : 'text-on-surface-muted hover:bg-surface-alt hover:text-on-surface'
                  }`}
                >
                  {item.icono}
                  <span className={`${!sidebarOpen ? 'lg:hidden' : ''}`}>{item.etiqueta}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}