'use client';

import { useState, useEffect } from 'react';
import { X, Download, FileText, Calendar, Loader2, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { generateTransactionsPdf } from '@/lib/exportPdf';

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
  const [pdfRawBlob, setPdfRawBlob] = useState<Blob | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState('');

  const loadPdfPreview = async () => {
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

    // Generate PDF
      const pdfResult = await generateTransactionsPdf({
        periodText: `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`,
        transactions: txData,
        totalIncome,
        totalExpense,
        userName: user?.name || 'Pengguna Moneta',
        userEmail: user?.email || '',
        returnBlob: true,
      });

      const pdfBlobUrl = (pdfResult as unknown) as string;

      setPdfUrl(pdfBlobUrl);
    } catch (err) {
      console.error('Gagal membuat preview PDF:', err);
      setError('Gagal memuat data laporan PDF.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPdfPreview();
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

  // FUNGSI KIRIM LAPORAN PDF KE EMAIL USER
  const handleSendEmail = async () => {
    if (!pdfUrl) return;
    setSendingEmail(true);
    setEmailSentSuccess(false);

    try {
      // Ambil file Blob dari Blob URL
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
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[85vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER MODAL */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Preview Laporan Keuangan</h2>
              <p className="text-[10px] text-slate-400 font-bold">PDF Siap Cetak & Kirim Email</p>
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
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-emerald-800 text-xs font-bold flex items-center gap-2 shrink-0 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Laporan PDF berhasil dikirimkan ke <strong className="underline">{user?.email}</strong></span>
          </div>
        )}

        {/* BODY AREA (PREVIEW PDF) */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center p-2">
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
              <span className="text-xs font-bold">Memuat logo & merender PDF...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center space-y-2 max-w-xs shadow-xs">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs text-slate-600 font-bold">{error}</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-xl border border-slate-200 bg-white shadow-xs"
              title="PDF Preview"
            />
          ) : null}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-3.5 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
          <span className="text-[11px] font-bold text-slate-400">
            {transactions.length} Mutasi Transaksi
          </span>

          <div className="flex gap-2">
            {/* TOMBOL KIRIM KE EMAIL */}
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

            {/* TOMBOL UNDUH */}
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