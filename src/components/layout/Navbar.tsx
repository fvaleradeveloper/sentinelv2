'use client';

import Link from 'next/link';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useUIStore } from '@/lib/store/useUIStore';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  titulo?: string;
}

export default function Navbar({ titulo = 'SENTINEL' }: NavbarProps) {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-surface-alt text-on-surface-muted transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="text-lg font-bold text-primary">
            {titulo}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="p-2 rounded-lg hover:bg-surface-alt text-on-surface-muted transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 rounded-lg hover:bg-surface-alt text-on-surface-muted transition-colors">
            <User size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-surface-alt text-on-surface-muted transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}