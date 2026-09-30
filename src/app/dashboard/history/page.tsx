'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { generateTransactionsPdf } from '@/lib/exportPdf';
import { Download, FileText, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Filter } from 'lucide-react';

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Filter Periode (Default Bulan Ini)
  const [currentDate, setCurrentDate] = useState(new Date());
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) setUser(JSON.parse(localUser));
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions', { params: { month, year } });
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [month, year]);

  const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Kalkulasi Ringkasan untuk PDF
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // FUNGSI EKSPOR PDF
  const handleExportPDF = () => {
    if (transactions.length === 0) {
      alert('Tidak ada data transaksi di periode ini untuk dicetak.');
      return;
    }

    setExporting(true);
    try {
      generateTransactionsPdf({
        periodText: monthName,
        transactions,
        totalIncome,
        totalExpense,
        userName: user?.name,
        userEmail: user?.email,
      });
    } catch (err) {
      console.error('Gagal membuat PDF:', err);
      alert('Terjadi kesalahan saat memproses file PDF.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 pb-24">
      {/* HEADER PAGE & TOMBOL CETAK PDF */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-700" />
            <span>Riwayat Transaksi</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{monthName}</p>
        </div>

        {/* TOMBOL CETAK PDF */}
        <button
          type="button"
          onClick={handleExportPDF}
          disabled={loading || exporting || transactions.length === 0}
          className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>{exporting ? 'Memproses...' : 'Cetak PDF'}</span>
        </button>
      </div>

      {/* DAFTAR TRANSAKSI SAAT INI */}
      {/* (Kodingan daftar transaksi riwayat kamu yang sudah ada) */}
    </div>
  );
}