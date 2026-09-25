'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Plus } from 'lucide-react';

export default function BottomNav({ onOpenTxModal }: { onOpenTxModal?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 px-8 py-2 flex justify-between items-center shadow-lg">
      {/* Overview Tab */}
      <Link
        href="/dashboard"
        className={`flex flex-col items-center space-y-1 w-12 ${
          pathname === '/dashboard' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px]">Overview</span>
      </Link>

      {/* Primary Floating Action Button (Catat Transaksi) */}
      <button
        onClick={onOpenTxModal}
        className="relative -top-4 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg border-4 border-slate-50 transition transform active:scale-95 flex items-center justify-center"
        title="Catat Transaksi Baru"
      >
        <Plus className="w-6 h-6 stroke-3" />
      </button>

      {/* Profil Tab */}
      <Link
        href="/dashboard/profile"
        className={`flex flex-col items-center space-y-1 w-12 ${
          pathname === '/dashboard/profile' ? 'text-emerald-700 font-extrabold' : 'text-slate-400'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profil</span>
      </Link>
    </nav>
  );
}