'use client';

import dynamic from 'next/dynamic';

const Doughnut = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Doughnut),
  { ssr: false }
);

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AsistenciaResumen {
  presentes: number;
  ausentes: number;
  tardanzas: number;
  permisos: number;
}

interface AsistenciaChartProps {
  datos: AsistenciaResumen;
}

export default function AsistenciaChart({ datos }: AsistenciaChartProps) {
  const chartData = {
    labels: ['Presentes', 'Ausentes', 'Tardanzas', 'Permisos'],
    datasets: [
      {
        data: [datos.presentes, datos.ausentes, datos.tardanzas, datos.permisos],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderWidth: 2,
        borderColor: 'var(--color-surface)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
    },
  };

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}