'use client';

import { useState, useEffect } from 'react';
import { X, Download, FileText, Calendar, Loader2, AlertCircle, Mail, CheckCircle2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import api from '@/lib/api';
import { generateTransactionsPdf } from '@/lib/exportPdf';
import { formatRupiah } from '@/lib/utils';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function PdfPreviewModal({ isOpen, onClose, user }: PdfPreviewModalProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, net: 0 });
  const [error, setError] = useState('');

  const loadPdfData = async () => {
    setLoading(true);
    setError('');
    setEmailSentSuccess(false);
    
    try {
      const res = await api.get('/transactions', {
        params: { month: selectedMonth, year: selectedYear },
      });
      
      const txData = res.data.data || [];
      setTransactions(txData);

      if (txData.length === 0) {
        setPdfUrl(null);
        setError(`Tidak ada transaksi pada ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}.`);
        return;
      }

      const totalIncome = txData
        .filter((t: any) => t.type === 'INCOME')
        .reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0);

      const totalExpense = txData
        .filter((t: any) => t.type === 'EXPENSE')
        .reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0);

      setSummary({
        income: totalIncome,
        expense: totalExpense,
        net: totalIncome - totalExpense,
      });

      // Generate PDF Blob URL
      const pdfResult = await generateTransactionsPdf({
        periodText: `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`,
        transactions: txData,
        totalIncome,
        totalExpense,
        userName: user?.name || 'Pengguna Moneta',
        userEmail: user?.email || '',
        returnBlob: true,
      });

      setPdfUrl((pdfResult as unknown) as string);
    } catch (err) {
      console.error('Gagal memuat data PDF:', err);
      setError('Gagal memuat data laporan PDF.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPdfData();
    } else {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [isOpen, selectedMonth, selectedYear]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `Moneta_Laporan_${MONTH_NAMES[selectedMonth - 1]}_${selectedYear}.pdf`;
    link.click();
  };

  const handleSendEmail = async () => {
    if (!pdfUrl) return;
    setSendingEmail(true);
    setEmailSentSuccess(false);

    try {
      const blobRes = await fetch(pdfUrl);
      const blobData = await blobRes.blob();

      const formData = new FormData();
      formData.append('file', blobData, `Moneta_Laporan_${MONTH_NAMES[selectedMonth - 1]}_${selectedYear}.pdf`);
      formData.append('month', String(selectedMonth));
      formData.append('year', String(selectedYear));
      formData.append('monthName', MONTH_NAMES[selectedMonth - 1]);

      await api.post('/reports/send-email', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setEmailSentSuccess(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengirim laporan ke email');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans text-slate-900">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER MODAL */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Pratinjau Laporan Keuangan</h2>
              <p className="text-[10px] text-slate-400 font-bold">Ringkasan Siap Cetak & Kirim Email</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FILTER PERIODE BULAN & TAHUN */}
        <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-extrabold text-slate-700">Periode:</span>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-hidden"
            >
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx + 1}>{m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-hidden"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* NOTIFIKASI EMAIL SUKSES */}
        {emailSentSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-emerald-800 text-xs font-bold flex items-center gap-2 shrink-0 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Laporan PDF berhasil dikirimkan ke <strong className="underline">{user?.email}</strong></span>
          </div>
        )}

        {/* BODY AREA (RESPONSIVE NATIVE PREVIEW CARD FOR MOBILE & PC) */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-3 space-y-3">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
              <span className="text-xs font-bold">Memuat data laporan...</span>
            </div>
          ) : error ? (
            <div className="py-12 px-6 bg-white rounded-2xl border border-slate-200 text-center space-y-2 max-w-xs mx-auto shadow-xs my-6">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs text-slate-600 font-bold">{error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3.5 text-slate-900">
              
              {/* HEADER BRAND DOKUMEN */}
              <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-xs text-white">
                    M
                  </div>
                  <div>
                    <p className="text-xs font-extrabold tracking-tight">Moneta Financial Report</p>
                    <p className="text-[10px] text-slate-400 font-medium">Periode {MONTH_NAMES[selectedMonth - 1]} {selectedYear}</p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-slate-800 text-emerald-400 font-mono font-bold rounded-md border border-slate-700">
                  PDF READY
                </span>
              </div>

              {/* SUMMARY STATS GRID */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 bg-emerald-50/80 border border-emerald-200/60 rounded-xl">
                  <p className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    Pemasukan
                  </p>
                  <p className="text-xs font-black text-emerald-700 mt-1">{formatRupiah(summary.income)}</p>
                </div>

                <div className="p-2.5 bg-rose-50/80 border border-rose-200/60 rounded-xl">
                  <p className="text-[9px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-rose-600" />
                    Pengeluaran
                  </p>
                  <p className="text-xs font-black text-rose-700 mt-1">{formatRupiah(summary.expense)}</p>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Wallet className="w-3 h-3 text-slate-700" />
                    Arus Kas
                  </p>
                  <p className={`text-xs font-black mt-1 ${summary.net >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                    {summary.net >= 0 ? '+' : ''}{formatRupiah(summary.net)}
                  </p>
                </div>
              </div>

              {/* TRANSACTIONS TABLE MINI PREVIEW */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Daftar Mutasi</span>
                  <span>{transactions.length} Transaksi</span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {transactions.map((tx, idx) => {
                    const isIncome = tx.type === 'INCOME';
                    const isTransfer = tx.type === 'TRANSFER';
                    const dateStr = new Date(tx.date || tx.createdAt).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                    });

                    return (
                      <div key={idx} className="p-2 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isTransfer ? 'bg-blue-500' : isIncome ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <div className="truncate">
                            <p className="font-bold text-slate-900 truncate text-[11px]">{tx.description || tx.notes || 'Transaksi'}</p>
                            <p className="text-[9px] text-slate-400 font-medium">{dateStr} • {tx.category?.name || 'Umum'}</p>
                          </div>
                        </div>

                        <span className={`font-black shrink-0 text-xs ${isTransfer ? 'text-slate-700' : isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isTransfer ? '' : isIncome ? '+' : '-'}{formatRupiah(Number(tx.amount || 0))}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-3.5 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
          <span className="text-[11px] font-bold text-slate-400">
            {transactions.length} Mutasi Transaksi
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={!pdfUrl || loading || sendingEmail}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {sendingEmail ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              ) : (
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{sendingEmail ? 'Mengirim...' : 'Kirim Email'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!pdfUrl || loading}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}