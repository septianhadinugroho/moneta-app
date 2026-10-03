'use client';

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowRightLeft, 
  ChevronRight, 
  ChevronLeft,
  X, 
  SlidersHorizontal,
  Loader2,
  Calendar
} from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import TransactionDetailModal from '@/components/modals/TransactionDetailModal';
import EditTransactionModal from '@/components/modals/EditTransactionModal';
import TransactionFilterDrawer from '@/components/transactions/TransactionFilterDrawer';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Month & Year State (Default: Bulan & Tahun Sekarang)
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // Filter Drawer State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');

  // Modal States
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [editingTx, setEditingTx] = useState<any>(null);

  const activeFilterCount = 
    (selectedWallet ? 1 : 0) + 
    (startDate && endDate ? 1 : 0) + 
    (typeFilter !== 'ALL' ? 1 : 0);

  // Fetch Daftar Wallet
  useEffect(() => {
    api.get('/wallets')
      .then((res) => setWallets(res.data.data || []))
      .catch((err) => console.error('Gagal memuat wallet:', err));
  }, []);

  // Fetch Transaksi Terfilter berdasarkan Month & Year
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const currentMonth = selectedDate.getMonth() + 1;
      const currentYear = selectedDate.getFullYear();

      const params: any = {
        month: currentMonth,
        year: currentYear,
        limit: 100, // Ambil seluruh transaksi dalam bulan terkait
      };

      if (search.trim()) params.search = search.trim();
      if (selectedWallet) params.walletId = selectedWallet;
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const res = await api.get('/transactions', { params });
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil transaksi:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, search, selectedWallet, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handler Navigasi Bulan (Maju / Mundur)
  const handlePrevMonth = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Grouping Transaksi Berdasarkan Tanggal
  const groupTransactionsByDate = (txList: any[]) => {
    const groups: { [key: string]: any[] } = {};

    txList.forEach((tx) => {
      if (typeFilter !== 'ALL' && String(tx.type).toUpperCase() !== typeFilter) return;

      const rawDate = tx.date || tx.createdAt;
      const d = rawDate ? new Date(rawDate) : new Date();
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      let dateKey = '';
      if (d.toDateString() === today.toDateString()) {
        dateKey = 'Hari Ini';
      } else if (d.toDateString() === yesterday.toDateString()) {
        dateKey = 'Kemarin';
      } else {
        dateKey = d.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      }

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(tx);
    });

    return groups;
  };

  const selectedWalletObj = wallets.find((w) => String(w.id) === String(selectedWallet));
  const groupedTransactions = groupTransactionsByDate(transactions);
  const groupedKeys = Object.keys(groupedTransactions);

  const formattedMonthLabel = selectedDate.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });

  const handleResetFilter = () => {
    setSearch('');
    setSelectedWallet('');
    setStartDate('');
    setEndDate('');
    setTypeFilter('ALL');
    setIsFilterOpen(false);
  };

  return (
    <div className="p-4 sm:p-5 space-y-3.5 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. DYNAMIC MONTH SELECTOR HEADER */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition cursor-pointer active:scale-95 border border-slate-200/50 dark:border-slate-700/50"
          title="Bulan Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-center">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white capitalize">
            {formattedMonthLabel}
          </h1>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition cursor-pointer active:scale-95 border border-slate-200/50 dark:border-slate-700/50"
          title="Bulan Berikutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. COMPACT SEARCH & FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2 transition-colors">
        <div className="flex items-center gap-2">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi bulan ini..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:border-slate-400 dark:focus:border-slate-500 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* FILTER BUTTON TRIGGER */}
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className={`p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition flex items-center justify-center gap-1.5 relative cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-700/60 ${
              activeFilterCount > 0 ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : ''
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 bg-emerald-600 text-white font-black text-[9px] rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {(selectedWallet || (startDate && endDate) || typeFilter !== 'ALL') && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-bold">
            {selectedWalletObj && (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1">
                Dompet: {selectedWalletObj.name}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedWallet('')} />
              </span>
            )}
            {startDate && endDate && (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1">
                {startDate} - {endDate}
                <X className="w-3 h-3 cursor-pointer" onClick={() => { setStartDate(''); setEndDate(''); }} />
              </span>
            )}
            {typeFilter !== 'ALL' && (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1">
                {typeFilter === 'EXPENSE' ? 'Pengeluaran' : 'Pemasukan'}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setTypeFilter('ALL')} />
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilter}
              className="text-rose-600 dark:text-rose-400 underline text-[10px] ml-auto font-extrabold cursor-pointer"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* 3. LIST TRANSAKSI DI-GROUP BERDASARKAN TANGGAL */}
      {loading ? (
        <div className="py-12 flex flex-col justify-center items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold">
          <Loader2 className="animate-spin w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <span>Memuat transaksi {formattedMonthLabel}...</span>
        </div>
      ) : groupedKeys.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center space-y-1">
          <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Belum Ada Transaksi</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Tidak ada transaksi dicatat pada bulan {formattedMonthLabel}.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedKeys.map((dateGroup) => (
            <div key={dateGroup} className="space-y-1.5">
              {/* TANGGAL HEADER */}
              <div className="px-1 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {dateGroup}
              </div>

              {/* CARD GROUP TRANSAKSI */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden transition-colors">
                {groupedTransactions[dateGroup].map((tx: any) => {
                  const txType = String(tx.type || '').toUpperCase();
                  const isIncome = txType === 'INCOME';
                  const isTransfer = txType === 'TRANSFER';
                  const catIcon = tx.category?.icon;
                  const catColor = tx.category?.color;

                  return (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      className="p-3 sm:p-3.5 flex justify-between items-center cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition group active:bg-slate-100/50 dark:active:bg-slate-800"
                    >
                      <div className="flex items-center space-x-3 min-w-0 pr-2">
                        {/* IKON KATEGORI KUSTOM ATAU TIPE TRANSAKSI */}
                        {catIcon ? (
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                            style={{ backgroundColor: catColor || '#64748b' }}
                          >
                            <CategoryIcon name={catIcon} className="w-4 h-4" />
                          </div>
                        ) : (
                          <div
                            className={`p-2.5 rounded-xl shrink-0 ${
                              isTransfer
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
                                : isIncome
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                            }`}
                          >
                            {isTransfer ? (
                              <ArrowRightLeft className="w-4 h-4" />
                            ) : isIncome ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4" />
                            )}
                          </div>
                        )}

                        <div className="truncate">
                          {/* BARIS UTAMA: DESKRIPSI TRANSAKSI */}
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {isTransfer
                              ? `Transfer (${tx.wallet?.name || 'Dompet'} ➔ ${tx.destinationWallet?.name || 'Tujuan'})`
                              : tx.description || tx.notes || tx.category?.name || 'Transaksi'}
                          </p>
                          {/* BARIS KEDUA: NAMA DOMPET */}
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
                            {isTransfer
                              ? 'Transfer Internal'
                              : tx.wallet?.name || 'Dompet'}
                          </p>
                        </div>
                      </div>

                      {/* NOMINAL */}
                      <div className="flex items-center space-x-2 shrink-0 pl-2">
                        <span
                          className={`text-xs font-black whitespace-nowrap ${
                            isTransfer
                              ? 'text-slate-700 dark:text-slate-300'
                              : isIncome
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isTransfer ? '' : isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FILTER DRAWER COMPONENT */}
      <TransactionFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        selectedWallet={selectedWallet}
        setSelectedWallet={setSelectedWallet}
        wallets={wallets}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        isWalletDropdownOpen={isWalletDropdownOpen}
        setIsWalletDropdownOpen={setIsWalletDropdownOpen}
        onApply={() => {
          setIsFilterOpen(false);
          fetchTransactions();
        }}
        onReset={handleResetFilter}
      />

      {/* MODAL DETAIL & EDIT TRANSAKSI */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
        onSuccess={fetchTransactions}
        onEditClick={(tx) => {
          setSelectedTx(null);
          setEditingTx(tx);
        }}
      />

      <EditTransactionModal
        isOpen={Boolean(editingTx)}
        onClose={() => setEditingTx(null)}
        transaction={editingTx}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}