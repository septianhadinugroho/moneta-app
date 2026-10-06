'use client';

import Link from 'next/link';
import { Target, Tag, FileText, ChevronRight, PieChart as PieIcon, Sparkles, CreditCard } from 'lucide-react';

interface MenuNavigationProps {
  user?: any;
}

export default function MenuNavigation({ user }: MenuNavigationProps) {
  return (
    <div className="space-y-2 font-sans">
      {/* TOMBOL ANALITIK & GRAFIK */}
      <Link
        href="/dashboard/stats"
        className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition shadow-2xs group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-105 transition-transform">
            <PieIcon className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white">Analitik & Grafik</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Visualisasi porsi pengeluaran & arus kas</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* TOMBOL TAGIHAN & LANGGANAN */}
      <Link
        href="/dashboard/subscriptions"
        className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition shadow-2xs group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-105 transition-transform">
            <CreditCard className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white">Tagihan & Langganan</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Kelola & pantau pengeluaran rutin bulanan</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* TOMBOL TARGET TABUNGAN / IMPIAN */}
      <Link
        href="/dashboard/goals"
        className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition shadow-2xs group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-105 transition-transform">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white">Target Tabungan & Impian</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Atur & pantau target dana masa depan</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* TOMBOL ANGGARAN BULANAN */}
      <Link
        href="/dashboard/budgets"
        className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition shadow-2xs group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-105 transition-transform">
            <Target className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white">Anggaran Bulanan</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Atur & pantau limit pengeluaran per kategori</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* TOMBOL KELOLA KATEGORI */}
      <Link
        href="/dashboard/categories"
        className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition shadow-2xs group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-105 transition-transform">
            <Tag className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white">Kelola Kategori</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Tambah, edit, atau hapus kategori transaksi</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* TOMBOL EKSPOR LAPORAN PDF */}
      <Link
        href="/dashboard/export"
        className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition shadow-2xs group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-105 transition-transform">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white">Ekspor Laporan PDF</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Pratinjau & cetak ringkasan transaksi bulanan</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}