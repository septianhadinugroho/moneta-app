'use client';

import Link from 'next/link';
import { Target, Tag, FileText, ChevronRight, PieChart as PieIcon, Sparkles, CreditCard, HandCoins } from 'lucide-react';

interface MenuNavigationProps {
  user?: any;
}

export default function MenuNavigation({ user }: MenuNavigationProps) {
  const menuItems = [
    {
      title: 'Analitik & Grafik',
      desc: 'Visualisasi porsi pengeluaran & arus kas',
      href: '/dashboard/stats',
      icon: PieIcon,
      bg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Tagihan & Langganan',
      desc: 'Kelola & pantau pengeluaran rutin bulanan',
      href: '/dashboard/subscriptions',
      icon: CreditCard,
      bg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Utang & Piutang',
      desc: 'Kelola hak piutang & kewajiban utang',
      href: '/dashboard/debts',
      icon: HandCoins,
      bg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Target Tabungan & Impian',
      desc: 'Atur & pantau target dana masa depan',
      href: '/dashboard/goals',
      icon: Sparkles,
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Anggaran Bulanan',
      desc: 'Atur & pantau limit pengeluaran per kategori',
      href: '/dashboard/budgets',
      icon: Target,
      bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Kelola Kategori',
      desc: 'Atur ikon & jenis kategori transaksi',
      href: '/dashboard/categories',
      icon: Tag,
      bg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Ekspor Laporan PDF',
      desc: 'Pratinjau & cetak ringkasan transaksi bulanan',
      href: '/dashboard/export',
      icon: FileText,
      bg: 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400',
    },
  ];

  return (
    <div className="space-y-2 font-sans">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition shadow-2xs group"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className={`p-2.5 rounded-xl ${item.bg} group-hover:scale-105 transition-transform shrink-0`}>
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <div className="truncate">
                <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{item.title}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">{item.desc}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
          </Link>
        );
      })}
    </div>
  );
}