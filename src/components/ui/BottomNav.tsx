'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Plus, Wallet, LayoutGrid } from 'lucide-react';

export default function BottomNav({ onOpenTxModal }: { onOpenTxModal?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 px-2 py-2 shadow-lg font-sans transition-colors duration-200">
      <div className="grid grid-cols-5 items-center justify-items-center">
        {/* 1. Dasbor */}
        <Link
          href="/dashboard"
          className={`flex flex-col items-center space-y-1 transition ${
            pathname === '/dashboard'
              ? 'text-emerald-600 dark:text-emerald-400 font-black'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-semibold'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dasbor</span>
        </Link>

        {/* 2. Riwayat */}
        <Link
          href="/dashboard/transactions"
          className={`flex flex-col items-center space-y-1 transition ${
            pathname === '/dashboard/transactions'
              ? 'text-emerald-600 dark:text-emerald-400 font-black'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-semibold'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px]">Riwayat</span>
        </Link>

        {/* 3. Catat (+) PERSIS DI TENGAH */}
        <div className="relative flex justify-center">
          <button
            onClick={onOpenTxModal}
            className="relative -top-5 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg border-4 border-slate-50 dark:border-slate-900 transition transform active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
            title="Catat Transaksi Baru"
          >
            <Plus className="w-6 h-6 stroke-3" />
          </button>
        </div>

        {/* 4. Dompet */}
        <Link
          href="/dashboard/wallets"
          className={`flex flex-col items-center space-y-1 transition ${
            pathname === '/dashboard/wallets'
              ? 'text-emerald-600 dark:text-emerald-400 font-black'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-semibold'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Dompet</span>
        </Link>

        {/* 5. Fitur (Menu Hub) */}
        <Link
          href="/dashboard/menu"
          className={`flex flex-col items-center space-y-1 transition ${
            pathname.startsWith('/dashboard/menu')
              ? 'text-emerald-600 dark:text-emerald-400 font-black'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-semibold'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px]">Fitur</span>
        </Link>
      </div>
    </nav>
  );
}