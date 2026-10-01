'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Target, Tag, FileText, ChevronRight, PieChart as PieIcon, Sparkles } from 'lucide-react';
import PdfPreviewModal from '@/components/modals/PdfPreviewModal';

interface MenuNavigationProps {
  user?: any;
}

export default function MenuNavigation({ user }: MenuNavigationProps) {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-2 font-sans">
        {/* TOMBOL ANALISTIK & GRAFIK */}
        <Link
          href="/dashboard/stats"
          className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 transition-transform">
              <PieIcon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">Analistik & Grafik</p>
              <p className="text-[10px] text-slate-400 font-medium">Visualisasi porsi pengeluaran & arus kas</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* TOMBOL TARGET TABUNGAN / IMPIAN */}
        <Link
          href="/dashboard/goals"
          className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">Target Tabungan & Impian</p>
              <p className="text-[10px] text-slate-400 font-medium">Atur & pantau target dana masa depan</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* TOMBOL ANGGARAN BULANAN */}
        <Link
          href="/dashboard/budgets"
          className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
              <Target className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">Anggaran Bulanan</p>
              <p className="text-[10px] text-slate-400 font-medium">Atur & pantau limit pengeluaran per kategori</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* TOMBOL KELOLA KATEGORI */}
        <Link
          href="/dashboard/categories"
          className="flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-105 transition-transform">
              <Tag className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">Kelola Kategori</p>
              <p className="text-[10px] text-slate-400 font-medium">Tambah, edit, atau hapus kategori transaksi</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* TOMBOL EKSPOR LAPORAN PDF */}
        <button
          type="button"
          onClick={() => setIsPdfModalOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group cursor-pointer text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
              <FileText className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">Ekspor Laporan PDF</p>
              <p className="text-[10px] text-slate-400 font-medium">Pratinjau & cetak ringkasan transaksi bulanan</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* MODAL PREVIEW PDF */}
      <PdfPreviewModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        user={user}
      />
    </>
  );
}