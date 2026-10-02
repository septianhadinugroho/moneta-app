'use client';

import { X, SlidersHorizontal, RotateCcw, Wallet as WalletIcon } from 'lucide-react';
import CustomDropdown from '@/components/ui/CustomDropdown';
import CustomDatePicker from '@/components/ui/CustomDatePicker';

interface TransactionFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  typeFilter: 'ALL' | 'EXPENSE' | 'INCOME';
  setTypeFilter: (type: 'ALL' | 'EXPENSE' | 'INCOME') => void;
  selectedWallet: string;
  setSelectedWallet: (walletId: string) => void;
  wallets: any[];
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  isWalletDropdownOpen: boolean;
  setIsWalletDropdownOpen: (open: boolean) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function TransactionFilterDrawer({
  isOpen,
  onClose,
  typeFilter,
  setTypeFilter,
  selectedWallet,
  setSelectedWallet,
  wallets,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isWalletDropdownOpen,
  setIsWalletDropdownOpen,
  onApply,
  onReset,
}: TransactionFilterDrawerProps) {
  if (!isOpen) return null;

  const walletOptions = [
    { id: '', name: 'Semua Dompet', icon: WalletIcon },
    ...wallets.map((w) => ({
      id: String(w.id),
      name: w.name,
      color: w.color || '#10b981',
    })),
  ];

  const selectedWalletOption = walletOptions.find(
    (opt) => String(opt.id) === String(selectedWallet)
  );

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 p-0 sm:p-4 font-sans">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200 transition-colors text-slate-900 dark:text-slate-100">
        
        {/* DRAWER HEADER */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-black text-slate-900 dark:text-white">Filter Transaksi</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* DRAWER BODY */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* TIPE TRANSAKSI */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 dark:text-slate-300 font-extrabold text-xs">Tipe Transaksi</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-extrabold">
              <button
                type="button"
                onClick={() => setTypeFilter('ALL')}
                className={`py-2 rounded-lg transition text-xs cursor-pointer ${
                  typeFilter === 'ALL'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('EXPENSE')}
                className={`py-2 rounded-lg transition text-xs cursor-pointer ${
                  typeFilter === 'EXPENSE'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('INCOME')}
                className={`py-2 rounded-lg transition text-xs cursor-pointer ${
                  typeFilter === 'INCOME'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          {/* DOMPET SELECTION */}
          <div className="space-y-1">
            <CustomDropdown
              label="Pilih Dompet"
              isOpen={isWalletDropdownOpen}
              onToggle={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
              selectedOption={selectedWalletOption}
              options={walletOptions}
              onSelect={(id) => {
                setSelectedWallet(id);
                setIsWalletDropdownOpen(false);
              }}
              placeholder="Semua Dompet"
              defaultIcon={WalletIcon}
            />
          </div>

          {/* DATE RANGE */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 dark:text-slate-300 font-extrabold text-xs">Rentang Tanggal</label>
            <div className="grid grid-cols-2 gap-2">
              <CustomDatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Dari Tanggal"
              />
              <CustomDatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Sampai Tanggal"
              />
            </div>
          </div>
        </div>

        {/* DRAWER FOOTER */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-2 text-rose-600 dark:text-rose-400 font-extrabold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onApply}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer active:scale-95"
          >
            Terapkan Filter
          </button>
        </div>

      </div>
    </div>
  );
}