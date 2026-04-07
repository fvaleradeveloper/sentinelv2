'use client';

import dynamic from 'next/dynamic';

const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { ssr: false }
);

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

interface TendenciaData {
  etiqueta: string;
  valor: number;
}

interface TendenciaChartProps {
  datos: TendenciaData[];
  titulo?: string;
  color?: string;
  simboloMoneda?: string;
}

export default function TendenciaChart({ datos, titulo, color = '#2563eb', simboloMoneda = 'S/' }: TendenciaChartProps) {
  const chartData = {
    labels: datos.map((d) => d.etiqueta),
    datasets: [
      {
        label: titulo || 'Tendencia',
        data: datos.map((d) => d.valor),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number } }) => `${simboloMoneda} ${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}