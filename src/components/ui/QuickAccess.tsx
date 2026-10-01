'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PieChart, Sparkles, Target, Tag, FileText, Wallet } from 'lucide-react';
import PdfPreviewModal from '@/components/modals/PdfPreviewModal';

export default function QuickAccess({ user }: { user?: any }) {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const shortcuts = [
    {
      title: 'Analistik',
      href: '/dashboard/stats',
      icon: PieChart,
      bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      title: 'Impian',
      href: '/dashboard/goals',
      icon: Sparkles,
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Anggaran',
      href: '/dashboard/budgets',
      icon: Target,
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      title: 'Kategori',
      href: '/dashboard/categories',
      icon: Tag,
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ];

  return (
    <>
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs font-sans">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black text-slate-900">Akses Cepat</h2>
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-1 rounded-lg border border-blue-100"
          >
            <FileText className="w-3 h-3" />
            <span>Cetak PDF</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {shortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-slate-50 transition group cursor-pointer active:scale-95"
              >
                <div className={`p-2.5 rounded-2xl border ${item.bg} group-hover:scale-105 transition-transform shadow-2xs`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-extrabold text-slate-700 mt-1.5 text-center truncate w-full">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <PdfPreviewModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        user={user}
      />
    </>
  );
}