'use client';

import Link from 'next/link';
import { 
  PieChart, 
  Sparkles, 
  Target, 
  HandCoins, 
  CreditCard, 
  FileText 
} from 'lucide-react';

export default function QuickAccess({ user }: { user?: any }) {
  const shortcuts = [
    {
      title: 'Analitik',
      href: '/dashboard/stats',
      icon: PieChart,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
    },
    {
      title: 'Tagihan',
      href: '/dashboard/subscriptions',
      icon: CreditCard,
      bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
    },
    {
      title: 'Utang',
      href: '/dashboard/debts',
      icon: HandCoins,
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
    },
    {
      title: 'Anggaran',
      href: '/dashboard/budgets',
      icon: Target,
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    },
    {
      title: 'Impian',
      href: '/dashboard/goals',
      icon: Sparkles,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    },
    {
      title: 'Cetak PDF',
      href: '/dashboard/export',
      icon: FileText,
      bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs font-sans transition-colors">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs font-black text-slate-900 dark:text-slate-100">Akses Cepat</h2>
        <span className="text-[10px] font-extrabold text-slate-400">6 Fitur Utama</span>
      </div>

      {/* GRID 3 KOLOM x 2 BARIS (RAPAT & TIDAK POTONG TULISAN) */}
      <div className="grid grid-cols-3 gap-2">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800 transition active:scale-95 cursor-pointer group"
            >
              <div className={`p-1.5 rounded-lg border ${item.bg} group-hover:scale-105 transition-transform shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}