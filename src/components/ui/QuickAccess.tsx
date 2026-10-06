'use client';

import Link from 'next/link';
import { PieChart, Sparkles, Target, Tag, CreditCard, FileText } from 'lucide-react';

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
      title: 'Impian',
      href: '/dashboard/goals',
      icon: Sparkles,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50',
    },
    {
      title: 'Anggaran',
      href: '/dashboard/budgets',
      icon: Target,
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50',
    },
    {
      title: 'Kategori',
      href: '/dashboard/categories',
      icon: Tag,
      bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs font-sans transition-colors">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-black text-slate-900 dark:text-slate-100">Akses Cepat</h2>
        <Link
          href="/dashboard/export"
          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-900/50 transition active:scale-95"
        >
          <FileText className="w-3 h-3" />
          <span>Cetak PDF</span>
        </Link>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group cursor-pointer active:scale-95"
            >
              <div className={`p-2 sm:p-2.5 rounded-2xl border ${item.bg} group-hover:scale-105 transition-transform shadow-2xs`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 mt-1.5 text-center truncate w-full">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}