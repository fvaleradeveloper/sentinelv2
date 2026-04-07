'use client';

import { ReactNode, useState } from 'react';

interface Tab {
  id: string;
  etiqueta: string;
  contenido: ReactNode;
  icono?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [tabActiva, setTabActiva] = useState(defaultTab || tabs[0]?.id || '');

  const contenidoActivo = tabs.find((t) => t.id === tabActiva)?.contenido;

  return (
    <div>
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTabActiva(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tabActiva === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-muted hover:text-on-surface hover:border-border'
            }`}
          >
            {tab.icono}
            {tab.etiqueta}
          </button>
        ))}
      </div>
      <div className="mt-4">{contenidoActivo}</div>
    </div>
  );
}