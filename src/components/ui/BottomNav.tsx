'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Plus, Wallet, User } from 'lucide-react';

export default function BottomNav({ onOpenTxModal }: { onOpenTxModal?: () => void }) {
  const pathname = usePathname();

  return (
    // Z-INDEX UBAH MENJADI z-30
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 z-30 px-2 py-2 shadow-lg">
      <div className="grid grid-cols-5 items-center justify-items-center">
        {/* 1. Overview */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center space-y-1 ${
            pathname === '/dashboard' ? 'text-emerald-700 font-black' : 'text-slate-400 font-semibold'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dasbor</span>
        </Link>

        {/* 2. Riwayat */}
        <Link
          href="/dashboard/transactions"
          className={`flex flex-col items-center space-y-1 ${
            pathname === '/dashboard/transactions' ? 'text-emerald-700 font-black' : 'text-slate-400 font-semibold'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px]">Riwayat</span>
        </Link>

        {/* 3. Catat (+) PERSIS DI TENGAH */}
        <div className="relative flex justify-center">
          <button
            onClick={onOpenTxModal}
            className="relative -top-5 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg border-4 border-slate-50 transition transform active:scale-95 flex items-center justify-center shrink-0"
            title="Catat Transaksi Baru"
          >
            <Plus className="w-6 h-6 stroke-3" />
          </button>
        </div>

        {/* 4. Dompet */}
        <Link
          href="/dashboard/wallets"
          className={`flex flex-col items-center space-y-1 ${
            pathname === '/dashboard/wallets' ? 'text-emerald-700 font-black' : 'text-slate-400 font-semibold'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Dompet</span>
        </Link>

        {/* 5. Profil */}
        <Link
          href="/dashboard/profile"
          className={`flex flex-col items-center space-y-1 ${
            pathname === '/dashboard/profile' ? 'text-emerald-700 font-black' : 'text-slate-400 font-semibold'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profil</span>
        </Link>
      </div>
    </nav>
  );
}