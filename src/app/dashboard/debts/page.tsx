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
  AlertCircle,
  Building2,
  Smartphone,
  Radio,
  Banknote,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  User,
  Clock,
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

  // Tab State: ALL | LOAN (Piutang) | DEBT (Utang)
  const [activeTab, setActiveTab] = useState<'ALL' | 'LOAN' | 'DEBT'>('ALL');

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

  const filteredDebts = useMemo(() => {
    if (activeTab === 'ALL') return debts;
    return debts.filter((d) => d.type === activeTab);
  }, [debts, activeTab]);

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
    <div className="p-4 sm:p-5 space-y-4 text-slate-900 dark:text-slate-100 transition-colors pb-24">
      {/* 1. HEADER HALAMAN */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Utang & Piutang</h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Kelola Hak Piutang & Kewajiban Utang</p>
        </div>
        <button
          type="button"
          onClick={() => { setDebtToEdit(null); setIsDebtModalOpen(true); }}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah</span>
        </button>
      </div>

      {/* 2. RINGKASAN REKAP UTANG & PIUTANG */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* CARD PIUTANG (Uang Kita di Orang) */}
        <div className="p-4 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 rounded-2xl border border-emerald-900/50 text-white space-y-1 shadow-md">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span>Total Piutang</span>
          </div>
          <p className="text-base sm:text-xl font-black text-emerald-300 tracking-tight">
            {formatRupiah(summary.totalLoanRemaining)}
          </p>
          <p className="text-[9px] text-emerald-200/60 font-medium">Uang kita yang dipinjam</p>
        </div>

        {/* CARD UTANG (Uang Orang di Kita) */}
        <div className="p-4 bg-gradient-to-br from-rose-900 via-slate-900 to-slate-950 rounded-2xl border border-rose-900/50 text-white space-y-1 shadow-md">
          <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-extrabold uppercase tracking-wider">
            <ArrowDownLeft className="w-3.5 h-3.5 shrink-0" />
            <span>Total Utang</span>
          </div>
          <p className="text-base sm:text-xl font-black text-rose-300 tracking-tight">
            {formatRupiah(summary.totalDebtRemaining)}
          </p>
          <p className="text-[9px] text-rose-200/60 font-medium">Kewajiban harus dibayar</p>
        </div>
      </div>

      {/* 3. TAB FILTER SWITCHER */}
      <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs font-extrabold">
        <button
          type="button"
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Semua ({debts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('LOAN')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'LOAN'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Piutang ({debts.filter((d) => d.type === 'LOAN').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('DEBT')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'DEBT'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          Utang ({debts.filter((d) => d.type === 'DEBT').length})
        </button>
      </div>

      {/* 4. LIST CATATAN UTANG / PIUTANG */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          <span className="text-xs font-bold">Memuat catatan utang & piutang...</span>
        </div>
      ) : filteredDebts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs font-black text-slate-700 dark:text-slate-300">Belum Ada Catatan</p>
          <p className="text-[11px] text-slate-400 font-medium max-w-xs mx-auto">
            Catat pinjaman teman atau utang pribadi agar pengembalian terpantau rapi.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDebts.map((item) => {
            const totalAmount = Number(item.amount);
            const paidAmount = Number(item.paidAmount || 0);
            const remaining = totalAmount - paidAmount;
            const isPaid = item.status === 'PAID' || remaining <= 0;
            const isLoan = item.type === 'LOAN';

            const progressPct = Math.min(100, Math.round((paidAmount / totalAmount) * 100));
            const walletBadge = getWalletTypeBadge(item.wallet?.type);
            const WalletIcon = walletBadge.icon;

            return (
              <div
                key={item.id}
                className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border transition-all space-y-3.5 ${
                  isPaid
                    ? 'border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/10 dark:bg-emerald-950/10'
                    : isLoan
                    ? 'border-slate-200/80 dark:border-slate-800'
                    : 'border-rose-200/60 dark:border-rose-950/40'
                }`}
              >
                {/* BARIS ATAS: TIPE, KONTAK, NOMINAL & AKSI EDIT/HAPUS */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                        isLoan
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <User className="w-5 h-5" />
                    </div>

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase ${
                            isLoan
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {isLoan ? 'Piutang' : 'Utang'}
                        </span>
                        <h3 className="font-black text-sm text-slate-900 dark:text-white truncate">
                          {item.personName}
                        </h3>

                        <button
                          type="button"
                          onClick={() => { setDebtToEdit(item); setIsDebtModalOpen(true); }}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                          title="Edit Catatan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="p-1 text-rose-400 hover:text-rose-600 transition cursor-pointer"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.dueDate && (
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            Jatuh tempo: {new Date(item.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* NOMINAL & STATUS */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                      {formatRupiah(remaining)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      {isPaid ? 'Lunas' : `Sisa dari ${formatRupiah(totalAmount)}`}
                    </p>
                  </div>
                </div>

                {/* PROGRESS BAR CICILAN */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Terbayar: {formatRupiah(paidAmount)}</span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${isLoan ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* BARIS BAWAH: METADATA & TOMBOL ACTION */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800/80 gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-extrabold border border-slate-200/50 dark:border-slate-700/50 shrink-0">
                    <div className={`p-0.5 rounded-md flex items-center justify-center shrink-0 ${walletBadge.iconBg}`}>
                      <WalletIcon className="w-3 h-3" />
                    </div>
                    <span className="truncate max-w-[100px]">{item.wallet?.name || 'Belum Atur'}</span>
                  </span>

                  {!isPaid && (
                    <button
                      type="button"
                      onClick={() => { setSelectedDebtForPay(item); setIsPayModalOpen(true); }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-[11px] rounded-xl transition flex items-center gap-1 shadow-2xs cursor-pointer ml-auto"
                    >
                      <HandCoins className="w-3.5 h-3.5" />
                      <span>{isLoan ? 'Terima Pelunasan' : 'Bayar Cicilan'}</span>
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