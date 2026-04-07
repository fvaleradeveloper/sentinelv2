'use client';

import dynamic from 'next/dynamic';

const Bar = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Bar),
  { ssr: false }
);

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface DeudaUnidad {
  unidad: string;
  monto: number;
}

interface DeudasChartProps {
  datos: DeudaUnidad[];
  simboloMoneda?: string;
}

export default function DeudasChart({ datos, simboloMoneda = 'S/' }: DeudasChartProps) {
  const sorted = [...datos].sort((a, b) => b.monto - a.monto).slice(0, 15);

  const chartData = {
    labels: sorted.map((d) => d.unidad),
    datasets: [
      {
        label: 'Deuda',
        data: sorted.map((d) => d.monto),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { x: number } }) => `${simboloMoneda} ${ctx.parsed.x.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => `${simboloMoneda} ${value}`,
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}