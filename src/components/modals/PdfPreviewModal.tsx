'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, Download, FileText, Calendar, Loader2, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { generateTransactionsPdf } from '@/lib/exportPdf';
import CustomDropdown from '@/components/ui/CustomDropdown';

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
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const [allUserTransactions, setAllUserTransactions] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        try {
          const res = await api.get('/transactions', { params: { limit: 1000 } });
          setAllUserTransactions(res.data.data || []);
        } catch (err) {
          console.error('Gagal mengambil histori tahun:', err);
        }
      };
      fetchHistory();
    }
  }, [isOpen]);

  const dynamicYears = useMemo(() => {
    const yearsSet = new Set<number>();
    yearsSet.add(currentYear);

    allUserTransactions.forEach((tx) => {
      if (tx.date || tx.createdAt) {
        const y = new Date(tx.date || tx.createdAt).getFullYear();
        if (!isNaN(y)) yearsSet.add(y);
      }
    });

    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [allUserTransactions, currentYear]);

  const yearOptions = useMemo(() => {
    return dynamicYears.map((year) => ({
      id: String(year),
      name: String(year),
    }));
  }, [dynamicYears]);

  const monthOptions = useMemo(() => {
    return MONTH_NAMES.map((name, idx) => ({
      id: String(idx + 1),
      name,
    }));
  }, []);

  const loadPdfData = async () => {
    setLoading(true);
    setError('');
    setEmailSentSuccess(false);

    try {
      const res = await api.get('/transactions', {
        params: { month: selectedMonth, year: selectedYear, limit: 1000 },
      });

      const txData = res.data.data || [];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs font-sans text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full h-[85vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors">
        
        {/* HEADER MODAL */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">Pratinjau Dokumen PDF</h2>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 font-bold">Laporan Resmi Siap Cetak</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Pratinjau Modal"
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* DROPDOWNS FILTER */}
        <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 shrink-0">
          <CustomDropdown
            label="Bulan"
            isOpen={isMonthDropdownOpen}
            onToggle={() => {
              setIsMonthDropdownOpen(!isMonthDropdownOpen);
              setIsYearDropdownOpen(false);
            }}
            selectedOption={monthOptions.find((m) => m.id === String(selectedMonth))}
            options={monthOptions}
            onSelect={(id) => {
              setSelectedMonth(Number(id));
              setIsMonthDropdownOpen(false);
            }}
            placeholder="Pilih Bulan"
            defaultIcon={Calendar}
          />

          <CustomDropdown
            label="Tahun"
            isOpen={isYearDropdownOpen}
            onToggle={() => {
              setIsYearDropdownOpen(!isYearDropdownOpen);
              setIsMonthDropdownOpen(false);
            }}
            selectedOption={{ id: String(selectedYear), name: String(selectedYear) }}
            options={yearOptions}
            onSelect={(id) => {
              setSelectedYear(Number(id));
              setIsYearDropdownOpen(false);
            }}
            placeholder="Pilih Tahun"
            defaultIcon={Calendar}
          />
        </div>

        {emailSentSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800 px-4 py-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Laporan PDF berhasil dikirimkan ke <strong className="underline">{user?.email}</strong></span>
          </div>
        )}

        {/* PDF VIEWPORT IFRAME (TAMPILAN LENGKAP BISA SCROLL SEMUA HALAMAN) */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold">Membuat dokumen PDF...</span>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-xs text-slate-600 dark:text-slate-300 font-bold max-w-xs">{error}</p>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-none"
              title="PDF Preview Moneta"
            />
          ) : null}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shrink-0">
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={!pdfUrl || loading || sendingEmail}
              className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
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