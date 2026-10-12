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
      bg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    },
    {
      title: 'Tagihan',
      href: '/dashboard/subscriptions',
      icon: CreditCard,
      bg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    },
    {
      title: 'Utang',
      href: '/dashboard/debts',
      icon: HandCoins,
      bg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    },
    {
      title: 'Anggaran',
      href: '/dashboard/budgets',
      icon: Target,
      bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    },
    {
      title: 'Impian',
      href: '/dashboard/goals',
      icon: Sparkles,
      bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    },
    {
      title: 'Cetak PDF',
      href: '/dashboard/export',
      icon: FileText,
      bg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    },
  ];

  return (
    <section 
      aria-label="Menu Akses Cepat"
      className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs font-sans transition-colors"
    >
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs font-black text-slate-900 dark:text-white">Akses Cepat</h2>
        <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300">6 Fitur Utama</span>
      </div>

      {/* GRID 3 KOLOM x 2 BARIS */}
      <div className="grid grid-cols-3 gap-2">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={`Menu ${item.title}`}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition active:scale-95 cursor-pointer group"
            >
              <div className={`p-1.5 rounded-lg border ${item.bg} group-hover:scale-105 transition-transform shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-900 dark:text-slate-100 truncate">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}