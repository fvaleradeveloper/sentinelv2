import Link from 'next/link';
import { ArrowUpCircle } from 'lucide-react';

interface UpgradeBannerProps {
  mensaje?: string;
}

export default function UpgradeBanner({ mensaje = 'Mejora tu plan para acceder a más funcionalidades' }: UpgradeBannerProps) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-primary to-primary-light p-4 text-on-primary">
      <div className="flex items-center gap-3">
        <ArrowUpCircle size={24} />
        <div className="flex-1">
          <p className="text-sm font-medium">{mensaje}</p>
        </div>
        <Link
          href="/sentinel-condominio/planes"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap"
        >
          Ver planes
        </Link>
      </div>
    </div>
  );
}