import WebappCard from './WebappCard';
import type { WebappManifest } from '@/lib/types/webapp';

interface WebappGridProps {
  webapps: WebappManifest[];
  suscripciones: string[];
}

export default function WebappGrid({ webapps, suscripciones }: WebappGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {webapps.map((webapp) => (
        <WebappCard
          key={webapp.slug}
          webapp={webapp}
          suscrito={suscripciones.includes(webapp.slug)}
        />
      ))}
    </div>
  );
}