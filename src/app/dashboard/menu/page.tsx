'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Target, Tag, FileText, ChevronRight, PieChart, Sparkles, Settings } from 'lucide-react';
import UserCard from '@/components/profile/UserCard';
import PdfPreviewModal from '@/components/modals/PdfPreviewModal';

export default function MenuHubPage() {
  const [user, setUser] = useState<any>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  const isGoogleUser = Boolean(user?.avatar || user?.googleId);

  return (
    <>
      <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 pb-28">
        {/* CARD USER IDENTIK DENGAN PROFILE PAGE */}
        <UserCard user={user} isGoogleUser={isGoogleUser} />

        {/* FITUR FINANSIAL */}
        <div className="space-y-2">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">Fitur Finansial</p>
          
          <Link
            href="/dashboard/stats"
            className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Analistik & Grafik</p>
                <p className="text-[10px] text-slate-400 font-medium">Visualisasi arus kas & pengeluaran</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/dashboard/goals"
            className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Target Tabungan & Impian</p>
                <p className="text-[10px] text-slate-400 font-medium">Atur goal finansial masa depan</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/dashboard/budgets"
            className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Anggaran Bulanan</p>
                <p className="text-[10px] text-slate-400 font-medium">Limit pengeluaran per kategori</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/dashboard/categories"
            className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Kelola Kategori</p>
                <p className="text-[10px] text-slate-400 font-medium">Kategori kustom transaksi</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* EKSPOR PDF */}
          <button
            type="button"
            onClick={() => setIsPdfModalOpen(true)}
            className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group cursor-pointer text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Ekspor Laporan PDF</p>
                <p className="text-[10px] text-slate-400 font-medium">Pratinjau & cetak ringkasan transaksi</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* PENGATURAN AKUN */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">Pengaturan & Keamanan</p>

          <Link
            href="/dashboard/profile"
            className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl hover:bg-slate-50 transition shadow-2xs group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900">Edit Profil & Kata Sandi</p>
                <p className="text-[10px] text-slate-400 font-medium">Ubah nama, email, dan password</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
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