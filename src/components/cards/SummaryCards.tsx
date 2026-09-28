'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';

export default function SummaryCards({ summary }: { summary: any }) {
  const [hideBalance, setHideBalance] = useState(false);

  // 1. Ambil Langsung dari Response Backend
  const calculatedNetWorth = summary?.totalNetWorth ?? summary?.total_balance ?? summary?.totalBalance ?? 0;
  
  // 2. Ambil Pemasukan & Pengeluaran dari Objek Backend
  const calculatedIncome =
    summary?.monthlySummary?.income ??
    summary?.monthlyIncome ??
    summary?.monthly_income ??
    0;

  const calculatedExpense =
    summary?.monthlySummary?.expense ??
    summary?.monthlyExpense ??
    summary?.monthly_expense ??
    0;

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const maskValue = (val: number) => (hideBalance ? '••••••••' : formatRupiah(val));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {/* TOTAL NET WORTH */}
      <div className="bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 p-5 rounded-2xl text-white shadow-md border border-slate-700/60 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <p className="text-[11px] font-semibold text-emerald-300 tracking-wider uppercase">Total Net Worth</p>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="text-slate-400 hover:text-white transition p-0.5"
                title={hideBalance ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
              >
                {hideBalance ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </div>
            <h2 className="text-2xl font-black mt-1 tracking-tight text-white">
              {maskValue(calculatedNetWorth)}
            </h2>
            <p className="text-[10px] text-slate-300/80 mt-1.5">Total akumulasi seluruh akun</p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* PEMASUKAN BULAN INI */}
      <div className="bg-white p-5 rounded-2xl border-l-4 border-l-emerald-500 border border-slate-200/80 shadow-xs flex justify-between items-start">
        <div>
          <p className="text-[11px] font-bold text-slate-500">
            Pemasukan ({monthNames[currentMonth]} {currentYear})
          </p>
          <h2 className="text-xl font-black text-slate-900 mt-1 tracking-tight">
            {maskValue(calculatedIncome)}
          </h2>
          <p className="text-[10px] font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Akumulasi Bulan Ini
          </p>
        </div>
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* PENGELUARAN BULAN INI */}
      <div className="bg-white p-5 rounded-2xl border-l-4 border-l-rose-500 border border-slate-200/80 shadow-xs flex justify-between items-start">
        <div>
          <p className="text-[11px] font-bold text-slate-500">
            Pengeluaran ({monthNames[currentMonth]} {currentYear})
          </p>
          <h2 className="text-xl font-black text-slate-900 mt-1 tracking-tight">
            {maskValue(calculatedExpense)}
          </h2>
          <p className="text-[10px] font-bold text-rose-600 mt-1.5 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Akumulasi Bulan Ini
          </p>
        </div>
        <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
          <TrendingDown className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}