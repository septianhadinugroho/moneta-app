'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '@/lib/api';
import {
  FileText,
  Download,
  Mail,
  Calendar,
  Wallet,
  Building2,
  Smartphone,
  Radio,
  Banknote,
  Filter,
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
} from 'lucide-react';
import { generateTransactionsPdf } from '@/lib/exportPdf';
import { formatRupiah } from '@/lib/utils';
import CustomDropdown from '@/components/ui/CustomDropdown';
import * as XLSX from 'xlsx';

const getWalletTypeBadge = (type?: string) => {
  switch (String(type || '').toUpperCase()) {
    case 'BANK': return { icon: Building2, iconBg: 'bg-sky-500/20 text-sky-400' };
    case 'E_WALLET': return { icon: Smartphone, iconBg: 'bg-purple-500/20 text-purple-400' };
    case 'E_MONEY': return { icon: Radio, iconBg: 'bg-lime-500/20 text-lime-400' };
    case 'CASH': return { icon: Banknote, iconBg: 'bg-emerald-500/20 text-emerald-400' };
    default: return { icon: Wallet, iconBg: 'bg-slate-500/20 text-slate-400' };
  }
};

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function ExportPage() {
  const currentYear = new Date().getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedWalletId, setSelectedWalletId] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [allUserTransactions, setAllUserTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userRes, walletRes, allTxRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/wallets'),
          api.get('/transactions', { params: { limit: 1000 } }),
        ]);
        
        if (userRes) setUser(userRes.data?.data || userRes.data);
        setWallets(walletRes.data?.data || []);
        setAllUserTransactions(allTxRes.data?.data || []);
      } catch (err) {
        console.error('Gagal mengambil data awal:', err);
      }
    };
    fetchInitialData();
  }, []);

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

  const monthOptions = MONTH_NAMES.map((name, idx) => ({ id: String(idx + 1), name }));

  const walletOptions = useMemo(() => {
    const list = [
      {
        id: 'ALL',
        name: 'Semua Dompet',
        icon: Wallet,
        iconBg: 'bg-emerald-500/20 text-emerald-400',
      },
    ];

    wallets.forEach((w) => {
      const badge = getWalletTypeBadge(w.type);
      list.push({
        id: String(w.id),
        name: w.name,
        icon: badge.icon,
        iconBg: badge.iconBg,
      });
    });

    return list;
  }, [wallets]);

  const fetchFilteredTransactions = async () => {
    setLoading(true);
    setEmailSentSuccess(false);
    try {
      const res = await api.get('/transactions', {
        params: { month: selectedMonth, year: selectedYear, limit: 1000 },
      });
      setTransactions(res.data?.data || []);
    } catch (err) {
      console.error('Gagal mengambil transaksi:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredTransactions();
  }, [selectedMonth, selectedYear]);

  const finalTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchWallet = selectedWalletId === 'ALL' || String(tx.walletId) === String(selectedWalletId);
      const matchType = selectedType === 'ALL' || tx.type === selectedType;
      return matchWallet && matchType;
    });
  }, [transactions, selectedWalletId, selectedType]);

  const summary = useMemo(() => {
    const income = finalTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const expense = finalTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return { income, expense, net: income - expense };
  }, [finalTransactions]);

  const handleDownloadPdf = async () => {
    await generateTransactionsPdf({
      periodText: `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`,
      transactions: finalTransactions,
      totalIncome: summary.income,
      totalExpense: summary.expense,
      userName: user?.name || 'Pengguna Moneta',
      userEmail: user?.email || '',
    });
  };

  const handleExportExcel = () => {
    if (finalTransactions.length === 0) return alert('Tidak ada data transaksi untuk diekspor');

    const formattedRows = [
      ['MONETA FINANCIAL REPORT'],
      [`Periode: ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`],
      [`Pemilik: ${user?.name || 'Pengguna Moneta'} (${user?.email || '-'})`],
      [],
      ['RINGKASAN KEUANGAN'],
      ['Total Pemasukan:', summary.income],
      ['Total Pengeluaran:', summary.expense],
      ['Arus Kas Bersih:', summary.net],
      [],
      ['No', 'Tanggal', 'Deskripsi / Catatan', 'Kategori', 'Dompet', 'Tipe Mutasi', 'Nominal (Rp)'],
    ];

    finalTransactions.forEach((tx, idx) => {
      formattedRows.push([
        idx + 1,
        new Date(tx.date || tx.createdAt).toLocaleDateString('id-ID'),
        tx.description || tx.notes || '-',
        tx.category?.name || 'Umum',
        tx.wallet?.name || 'Dompet',
        tx.type === 'INCOME' ? 'PEMASUKAN' : tx.type === 'EXPENSE' ? 'PENGELUARAN' : 'TRANSFER',
        Number(tx.amount || 0),
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(formattedRows);

    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 14 },
      { wch: 32 },
      { wch: 20 },
      { wch: 20 },
      { wch: 16 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan Mutasi');

    const fileName = `Moneta_Laporan_${MONTH_NAMES[selectedMonth - 1]}_${selectedYear}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    setEmailSentSuccess(false);
    try {
      const pdfBlobUrl = (await generateTransactionsPdf({
        periodText: `${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`,
        transactions: finalTransactions,
        totalIncome: summary.income,
        totalExpense: summary.expense,
        userName: user?.name || 'Pengguna Moneta',
        userEmail: user?.email || '',
        returnBlob: true,
      })) as unknown as string;

      const blobRes = await fetch(pdfBlobUrl);
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
    <div className="w-full max-w-xl md:max-w-4xl mx-auto p-3 sm:p-6 space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            Laporan & Ekspor Keuangan
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
            Atur parameter, pratinjau lembar pembukuan, dan cetak dokumen resmi
          </p>
        </div>

        {emailSentSuccess && (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dikirim ke <strong>{user?.email}</strong></span>
          </div>
        )}
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 w-full">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <span>Filter Laporan</span>
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          <div className="grid grid-cols-2 gap-2">
            <CustomDropdown
              label="Bulan"
              isOpen={isMonthOpen}
              onToggle={() => { setIsMonthOpen(!isMonthOpen); setIsYearOpen(false); setIsWalletOpen(false); }}
              selectedOption={monthOptions.find((m) => m.id === String(selectedMonth))}
              options={monthOptions}
              onSelect={(id) => { setSelectedMonth(Number(id)); setIsMonthOpen(false); }}
              placeholder="Pilih Bulan"
              defaultIcon={Calendar}
            />

            <CustomDropdown
              label="Tahun"
              isOpen={isYearOpen}
              onToggle={() => { setIsYearOpen(!isYearOpen); setIsMonthOpen(false); setIsWalletOpen(false); }}
              selectedOption={{ id: String(selectedYear), name: String(selectedYear) }}
              options={yearOptions}
              onSelect={(id) => { setSelectedYear(Number(id)); setIsYearOpen(false); }}
              placeholder="Pilih Tahun"
              defaultIcon={Calendar}
            />
          </div>

          <CustomDropdown
            label="Sumber Dompet"
            isOpen={isWalletOpen}
            onToggle={() => { setIsWalletOpen(!isWalletOpen); setIsMonthOpen(false); setIsYearOpen(false); }}
            selectedOption={walletOptions.find((w) => String(w.id) === String(selectedWalletId))}
            options={walletOptions}
            onSelect={(id) => { setSelectedWalletId(id); setIsWalletOpen(false); }}
            placeholder="Pilih Dompet"
            defaultIcon={Wallet}
          />

          <div className="space-y-1 w-full">
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">Tipe Mutasi</label>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-[11px] font-extrabold h-10 items-center w-full">
              <button
                type="button"
                onClick={() => setSelectedType('ALL')}
                className={`flex-1 py-1.5 rounded-xl transition cursor-pointer text-center text-xs ${selectedType === 'ALL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('INCOME')}
                className={`flex-1 py-1.5 rounded-xl transition cursor-pointer text-center text-xs ${selectedType === 'INCOME' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('EXPENSE')}
                className={`flex-1 py-1.5 rounded-xl transition cursor-pointer text-center text-xs ${selectedType === 'EXPENSE' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA: SELALU STACKED 1 KOLOM RAPUH KEK VERSI MOBILE */}
      <div className="flex flex-col gap-4 items-stretch w-full">
        
        {/* PREVIEW CONTAINER */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-md space-y-4 transition-colors min-w-0">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shadow-xs shrink-0">
                M
              </div>
              <div className="min-w-0">
                <h2 className="text-xs sm:text-base font-black text-slate-900 dark:text-white tracking-tight truncate">MONETA FINANCIAL REPORT</h2>
                <p className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider truncate">
                  PERIODE {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                </p>
              </div>
            </div>

            <span className="text-[9px] sm:text-[10px] px-2 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold rounded-lg border border-emerald-300 dark:border-emerald-800 shrink-0">
              {loading ? 'MEMUAT...' : `${finalTransactions.length} MUTASI`}
            </span>
          </div>

          {/* CARD RINGKASAN SALDO: DIBUAT 1 KOLOM KE BAWAH DENGAN DISPLAY FLEX */}
          <div className="flex flex-col gap-2 w-full">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl sm:rounded-2xl flex justify-between items-center">
              <p className="text-[10px] sm:text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">PEMASUKAN</p>
              <p className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400">{formatRupiah(summary.income)}</p>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl sm:rounded-2xl flex justify-between items-center">
              <p className="text-[10px] sm:text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">PENGELUARAN</p>
              <p className="text-xs sm:text-sm font-black text-rose-700 dark:text-rose-400">{formatRupiah(summary.expense)}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl flex justify-between items-center">
              <p className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">ARUS KAS</p>
              <p className={`text-xs sm:text-sm font-black ${summary.net >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
                {summary.net >= 0 ? '+' : ''}{formatRupiah(summary.net)}
              </p>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider px-1">
              <span>Pratinjau Lembar Mutasi</span>
              <span>{finalTransactions.length} ITEM</span>
            </div>

            {loading ? (
              <div className="py-12 text-center space-y-2 text-slate-600 dark:text-slate-300">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-emerald-600" />
                <p className="text-xs font-bold">Memuat lembar kerja...</p>
              </div>
            ) : finalTransactions.length === 0 ? (
              <div className="py-10 bg-slate-50 dark:bg-slate-800/30 rounded-2xl text-center text-xs text-slate-600 dark:text-slate-300 font-bold border border-dashed border-slate-200 dark:border-slate-800">
                Tidak ada riwayat mutasi transaksi pada kriteria filter ini.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1 text-xs w-full">
                {finalTransactions.map((tx, idx) => {
                  const isIncome = tx.type === 'INCOME';
                  const isTransfer = tx.type === 'TRANSFER';
                  const dateStr = new Date(tx.date || tx.createdAt).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                  });

                  return (
                    <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl flex justify-between items-center gap-2 w-full">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className={`p-1.5 rounded-xl text-white shrink-0 ${isTransfer ? 'bg-blue-500' : isIncome ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                          {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-extrabold text-slate-900 dark:text-white truncate text-[11px] sm:text-xs">{tx.description || tx.notes || 'Tanpa Catatan'}</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-300 font-medium truncate">
                            {dateStr} • {tx.category?.name || 'Umum'} • <span className="font-bold text-slate-700 dark:text-slate-200">{tx.wallet?.name || 'Dompet'}</span>
                          </p>
                        </div>
                      </div>

                      <span className={`font-black shrink-0 text-xs sm:text-xs text-right ${isTransfer ? 'text-slate-800 dark:text-slate-200' : isIncome ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                        {isTransfer ? '' : isIncome ? '+' : '-'}{formatRupiah(Number(tx.amount || 0))}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2 text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-300 text-center font-medium border-t border-slate-100 dark:border-slate-800">
            Di-generate otomatis oleh Moneta App • Pemilik: <strong className="text-slate-900 dark:text-white">{user?.name || 'Pengguna'}</strong>
          </div>
        </div>

        {/* CARD ACTION EKSPOR (STACKED DI BAWAH PREVIEW) */}
        <div className="w-full bg-slate-900 dark:bg-slate-900 border border-transparent dark:border-slate-800 text-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xl space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Siap Ekspor
            </span>
            <h3 className="text-xs sm:text-sm font-black text-white pt-1">Opsi Unduh & Cetak</h3>
            <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium leading-relaxed">
              Pilih format dokumen resmi pembukuan keuangan yang kamu butuhkan.
            </p>
          </div>

          <div className="space-y-2 pt-1 w-full">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={loading || finalTransactions.length === 0}
              className="w-full py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl sm:rounded-2xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Unduh Dokumen PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={loading || finalTransactions.length === 0}
              className="w-full py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl sm:rounded-2xl transition border border-slate-700 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ekspor File Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              disabled={loading || sendingEmail || finalTransactions.length === 0}
              className="w-full py-2.5 sm:py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs rounded-xl sm:rounded-2xl transition border border-slate-700 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400 shrink-0" /> : <Mail className="w-4 h-4 text-blue-400 shrink-0" />}
              <span>{sendingEmail ? 'Mengirim...' : 'Kirim Laporan ke Email'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}