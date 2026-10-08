'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  HandCoins,
  Plus,
  Loader2,
  CheckCircle2,
  Trash2,
  Edit3,
  ShieldAlert,
  Calendar,
  Building2,
  Smartphone,
  Radio,
  Banknote,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  Search,
  History,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import DebtModal from '@/components/modals/DebtModal';
import PayDebtModal from '@/components/modals/PayDebtModal';
import ConfirmModal from '@/components/modals/ConfirmModal';

const getWalletTypeBadge = (type?: string) => {
  switch (String(type || '').toUpperCase()) {
    case 'BANK': return { icon: Building2, iconBg: 'bg-sky-500/20 text-sky-400' };
    case 'E_WALLET': return { icon: Smartphone, iconBg: 'bg-purple-500/20 text-purple-400' };
    case 'E_MONEY': return { icon: Radio, iconBg: 'bg-lime-500/20 text-lime-400' };
    case 'CASH': return { icon: Banknote, iconBg: 'bg-emerald-500/20 text-emerald-400' };
    default: return { icon: Wallet, iconBg: 'bg-slate-500/20 text-slate-400' };
  }
};

export default function DebtsPage() {
  const [debts, setDebts] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalLoanRemaining: 0, totalDebtRemaining: 0 });
  const [loading, setLoading] = useState(true);

  // Main Mode: ACTIVE (Belum Lunas) | COMPLETED (Riwayat Selesai)
  const [mainTab, setMainTab] = useState<'ACTIVE' | 'COMPLETED'>('ACTIVE');

  // Sub Tab Filter: ALL | LOAN | DEBT
  const [activeTab, setActiveTab] = useState<'ALL' | 'LOAN' | 'DEBT'>('ALL');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [debtToEdit, setDebtToEdit] = useState<any>(null);

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedDebtForPay, setSelectedDebtForPay] = useState<any>(null);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'warning' | 'primary';
    confirmLabel?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'primary',
  });

  const fetchDebts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/debts');
      setDebts(res.data.data || []);
      setSummary(res.data.summary || { totalLoanRemaining: 0, totalDebtRemaining: 0 });
    } catch (err) {
      console.error('Gagal memuat catatan utang/piutang:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const activeDebts = useMemo(() => {
    return debts.filter((d) => {
      const remaining = Number(d.amount) - Number(d.paidAmount || 0);
      return d.status !== 'PAID' && remaining > 0;
    });
  }, [debts]);

  const completedDebts = useMemo(() => {
    return debts.filter((d) => {
      const remaining = Number(d.amount) - Number(d.paidAmount || 0);
      return d.status === 'PAID' || remaining <= 0;
    });
  }, [debts]);

  const currentList = useMemo(() => {
    const baseList = mainTab === 'ACTIVE' ? activeDebts : completedDebts;
    
    return baseList.filter((item) => {
      const matchType = activeTab === 'ALL' || item.type === activeTab;
      const matchQuery = item.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchQuery;
    });
  }, [activeDebts, completedDebts, mainTab, activeTab, searchQuery]);

  const frequentContacts = useMemo(() => {
    const counts: Record<string, { count: number; totalAmount: number; type: string }> = {};
    
    completedDebts.forEach((d) => {
      const name = d.personName.trim();
      if (!counts[name]) {
        counts[name] = { count: 0, totalAmount: 0, type: d.type };
      }
      counts[name].count += 1;
      counts[name].totalAmount += Number(d.amount);
    });

    return Object.entries(counts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [completedDebts]);

  const handleDelete = (debt: any) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Hapus Catatan',
      message: `Apakah kamu yakin ingin menghapus catatan "${debt.personName}"?`,
      variant: 'danger',
      confirmLabel: 'Ya, Hapus',
      onConfirm: async () => {
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        try {
          await api.delete(`/debts/${debt.id}`);
          fetchDebts();
        } catch (err) {
          console.error('Gagal menghapus catatan:', err);
        }
      },
    });
  };

  return (
    <div className="p-3.5 sm:p-5 space-y-3.5 text-slate-900 dark:text-slate-100 transition-colors pb-24 font-sans max-w-lg mx-auto">
      {/* 1. HEADER HALAMAN */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-base font-black text-slate-900 dark:text-white">Utang & Piutang</h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Kelola Hak Piutang & Kewajiban Utang</p>
        </div>
        <button
          type="button"
          onClick={() => { setDebtToEdit(null); setIsDebtModalOpen(true); }}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>

      {/* 2. RINGKASAN CARDS SLIM & RAMPING (1 BARIS TITLE) */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-linear-to-br from-emerald-950/80 via-slate-900 to-slate-950 rounded-2xl border border-emerald-900/40 text-white space-y-0.5 shadow-xs">
          <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-black tracking-wider uppercase">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">PIUTANG</span>
          </div>
          <p className="text-base sm:text-lg font-black text-emerald-300 tracking-tight leading-tight">
            {formatRupiah(summary.totalLoanRemaining)}
          </p>
        </div>

        <div className="p-3 bg-linear-to-br from-rose-950/80 via-slate-900 to-slate-950 rounded-2xl border border-rose-900/40 text-white space-y-0.5 shadow-xs">
          <div className="flex items-center gap-1 text-rose-400 text-[10px] font-black tracking-wider uppercase">
            <ArrowDownLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">UTANG</span>
          </div>
          <p className="text-base sm:text-lg font-black text-rose-300 tracking-tight leading-tight">
            {formatRupiah(summary.totalDebtRemaining)}
          </p>
        </div>
      </div>

      {/* 3. MODE SWITCHER: AKTIF VS RIWAYAT SELESAI */}
      <div className="flex p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl text-xs font-extrabold">
        <button
          type="button"
          onClick={() => setMainTab('ACTIVE')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mainTab === 'ACTIVE'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Berjalan ({activeDebts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab('COMPLETED')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
            mainTab === 'COMPLETED'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5 text-emerald-500" />
          <span>Selesai ({completedDebts.length})</span>
        </button>
      </div>

      {/* 4. FREQUENT CONTACTS (KHUSUS SELESAI) */}
      {mainTab === 'COMPLETED' && frequentContacts.length > 0 && (
        <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sering Bertransaksi (Lunas)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {frequentContacts.map((c, idx) => (
              <div key={idx} className="p-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs flex justify-between items-center">
                <div className="truncate">
                  <p className="font-extrabold text-white text-xs truncate">{c.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold">{c.count}x transaksi</p>
                </div>
                <span className="text-[10px] font-black text-indigo-300 ml-1">{formatRupiah(c.totalAmount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SEARCH & FILTER TIPE */}
      <div className="space-y-1.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kontak atau catatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LOAN')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'LOAN'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Piutang
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('DEBT')}
            className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'DEBT'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Utang
          </button>
        </div>
      </div>

      {/* 6. LIST UTANG & PIUTANG (DESAIN COMPACT & CLEAN) */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          <span className="text-xs font-bold">Memuat catatan...</span>
        </div>
      ) : currentList.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 text-center space-y-1.5">
          <ShieldAlert className="w-7 h-7 text-slate-400 mx-auto" />
          <p className="text-xs font-black text-slate-700 dark:text-slate-300">
            {mainTab === 'ACTIVE' ? 'Tidak Ada Utang/Piutang Berjalan' : 'Belum Ada Transaksi Selesai'}
          </p>
          <p className="text-[10px] text-slate-400 font-medium max-w-xs mx-auto">
            {mainTab === 'ACTIVE'
              ? 'Semua catatan utang dan piutang kamu sudah lunas.'
              : 'Riwayat transaksi yang telah lunas akan tersimpan di sini.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {currentList.map((item) => {
            const totalAmount = Number(item.amount);
            const paidAmount = Number(item.paidAmount || 0);
            const remaining = Math.max(0, totalAmount - paidAmount);
            const isPaid = item.status === 'PAID' || remaining <= 0;
            const isLoan = item.type === 'LOAN';

            const progressPct = Math.min(100, Math.round((paidAmount / totalAmount) * 100));
            const walletBadge = getWalletTypeBadge(item.wallet?.type);
            const WalletIcon = walletBadge.icon;

            return (
              <div
                key={item.id}
                className={`p-3 bg-white dark:bg-slate-900 rounded-2xl border transition-all space-y-2.5 ${
                  isPaid
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : isLoan
                    ? 'border-slate-200/80 dark:border-slate-800'
                    : 'border-rose-500/30 dark:border-rose-950/40'
                }`}
              >
                {/* BARIS ATAS: IKON + NAMA KONTAK & NOMINAL + TOMBOL AKSI */}
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isPaid
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isLoan
                          ? 'bg-emerald-500/20 text-emerald-500'
                          : 'bg-rose-500/20 text-rose-500'
                      }`}
                    >
                      {isPaid ? <CheckCircle2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="truncate">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white truncate">
                        {item.personName}
                      </h3>
                      {item.notes && (
                        <p className="text-[10px] text-slate-400 truncate">{item.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: NOMINAL & ACTION BUTTONS */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <p className={`text-xs sm:text-sm font-black tracking-tight ${isPaid ? 'text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                        {isPaid ? formatRupiah(totalAmount) : formatRupiah(remaining)}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold">
                        {isPaid ? 'Lunas' : `Sisa dari ${formatRupiah(totalAmount)}`}
                      </p>
                    </div>

                    {!isPaid && (
                      <div className="flex items-center gap-0.5 border-l border-slate-100 dark:border-slate-800 pl-1">
                        <button
                          type="button"
                          onClick={() => { setDebtToEdit(item); setIsDebtModalOpen(true); }}
                          className="p-1 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="p-1 text-rose-400 hover:text-rose-600 transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* PROGRESS BAR CICILAN */}
                {!isPaid && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-bold text-slate-400">
                      <span>Terbayar: {formatRupiah(paidAmount)}</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${isLoan ? 'bg-emerald-500' : 'bg-rose-500'}`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* BARIS BAWAH: METADATA & TOMBOL PELUNASAN (DESAIN SEJAJAR SLIM) */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800/80 gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* BADGE TIPE (UTANG / PIUTANG) */}
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase ${
                        isLoan
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {isLoan ? 'Piutang' : 'Utang'}
                    </span>

                    {/* BADGE DOMPET */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 rounded-lg text-[9px] font-extrabold border border-slate-200/50 dark:border-slate-700/50">
                      <div className={`p-0.5 rounded-xs flex items-center justify-center shrink-0 ${walletBadge.iconBg}`}>
                        <WalletIcon className="w-2.5 h-2.5" />
                      </div>
                      <span className="truncate max-w-20">{item.wallet?.name || 'Utang'}</span>
                    </span>

                    {/* BADGE JATUH TEMPO */}
                    {item.dueDate && !isPaid && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-slate-400 text-[9px] font-bold">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{new Date(item.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </span>
                    )}
                  </div>

                  {/* ACTION BUTTON */}
                  {!isPaid ? (
                    <button
                      type="button"
                      onClick={() => { setSelectedDebtForPay(item); setIsPayModalOpen(true); }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-[10px] rounded-lg transition flex items-center gap-1 shadow-2xs cursor-pointer ml-auto"
                    >
                      <HandCoins className="w-3 h-3" />
                      <span>{isLoan ? 'Terima Pelunasan' : 'Bayar Cicilan'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer ml-auto flex items-center gap-1 text-[9px] font-bold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALS */}
      <DebtModal
        isOpen={isDebtModalOpen}
        onClose={() => setIsDebtModalOpen(false)}
        debtToEdit={debtToEdit}
        onSuccess={fetchDebts}
      />

      <PayDebtModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        debt={selectedDebtForPay}
        onSuccess={fetchDebts}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        variant={confirmConfig.variant}
        confirmLabel={confirmConfig.confirmLabel}
      />
    </div>
  );
}