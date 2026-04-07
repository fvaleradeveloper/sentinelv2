import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function SentinelCondominioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-alt">
      <Navbar titulo="Sentinel Condominio" />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 mt-0 transition-all">
          {children}
        </main>
      </div>
    </div>
  );
}