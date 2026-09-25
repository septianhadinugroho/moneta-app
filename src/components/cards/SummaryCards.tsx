'use client';

import { formatRupiah } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export default function SummaryCards({
  summary,
  wallets = [],
}: {
  summary: any;
  wallets?: any[];
}) {
  const calculatedNetWorth =
    summary?.totalNetWorth ??
    summary?.totalBalance ??
    wallets.reduce((acc: number, curr: any) => acc + (Number(curr.balance) || 0), 0);

  const txList: any[] = summary?.recentTransactions || summary?.transactions || [];

  // Filter tanggal bulan berjalan secara dinamis
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTx = txList.filter((t: any) => {
    const txDate = new Date(t.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  const calculatedIncome = currentMonthTx
    .filter((t: any) => t.type === 'INCOME')
    .reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);

  const calculatedExpense = currentMonthTx
    .filter((t: any) => t.type === 'EXPENSE')
    .reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {/* TOTAL NET WORTH */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl text-white shadow-xs flex justify-between items-start">
        <div>
          <p className="text-[11px] font-medium text-slate-400">Total Akumulasi</p>
          <h2 className="text-xl sm:text-2xl font-black mt-0.5 tracking-tight text-white">
            {formatRupiah(calculatedNetWorth)}
          </h2>
          <p className="text-[10px] text-slate-400 mt-1">Seluruh saldo dompet & rekening</p>
        </div>
        <div className="p-2 bg-slate-800 rounded-xl border border-slate-700/60">
          <Wallet className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* PEMASUKAN BULAN INI */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-start">
        <div>
          <p className="text-[11px] font-semibold text-slate-500">
            Pemasukan ({monthNames[currentMonth]} {currentYear})
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
            {formatRupiah(calculatedIncome)}
          </h2>
          <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Pemasukan Aktif
          </p>
        </div>
        <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      {/* PENGELUARAN BULAN INI */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-start">
        <div>
          <p className="text-[11px] font-semibold text-slate-500">
            Pengeluaran ({monthNames[currentMonth]} {currentYear})
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
            {formatRupiah(calculatedExpense)}
          </h2>
          <p className="text-[10px] font-bold text-rose-600 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Pengeluaran Aktif
          </p>
        </div>
        <div className="p-2 bg-rose-50 rounded-xl border border-rose-100">
          <TrendingDown className="w-4 h-4 text-rose-600" />
        </div>
      </div>
    </div>
  );
}