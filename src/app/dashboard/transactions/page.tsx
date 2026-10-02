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
  Wallet as WalletIcon
} from 'lucide-react';
import TransactionDetailModal from '@/components/modals/TransactionDetailModal';
import EditTransactionModal from '@/components/modals/EditTransactionModal';
import TransactionFilterDrawer from '@/components/transactions/TransactionFilterDrawer';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter Drawer State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  // Modal States
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [editingTx, setEditingTx] = useState<any>(null);

  const activeFilterCount = 
    (selectedWallet ? 1 : 0) + 
    (startDate && endDate ? 1 : 0) + 
    (typeFilter !== 'ALL' ? 1 : 0);

  useEffect(() => {
    api.get('/wallets')
      .then((res) => setWallets(res.data.data || []))
      .catch((err) => console.error('Gagal memuat wallet:', err));
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (search.trim()) params.search = search.trim();
      if (selectedWallet) params.walletId = selectedWallet;
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const res = await api.get('/transactions', { params });
      setTransactions(res.data.data || []);

      if (res.data.pagination) {
        setPaginationMeta(res.data.pagination);
      }
    } catch (err) {
      console.error('Gagal mengambil transaksi:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, selectedWallet, startDate, endDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatDate = (rawDate: string) => {
    if (!rawDate) return '';
    const d = new Date(rawDate);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const selectedWalletObj = wallets.find((w) => String(w.id) === String(selectedWallet));

  const filteredTx = transactions.filter((tx) => {
    if (typeFilter === 'ALL') return true;
    return String(tx.type).toUpperCase() === typeFilter;
  });

  const handleResetFilter = () => {
    setSearch('');
    setSelectedWallet('');
    setStartDate('');
    setEndDate('');
    setTypeFilter('ALL');
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  return (
    <div className="p-4 sm:p-5 space-y-3.5 font-sans text-slate-900 dark:text-slate-100 pb-28 transition-colors">
      {/* HEADER PAGE */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Riwayat Transaksi</h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
            Total {paginationMeta.totalItems} Transaksi
          </p>
        </div>
        <span className="px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 text-[11px] font-black rounded-xl border dark:border-slate-700">
          Hal {currentPage} / {paginationMeta.totalPages || 1}
        </span>
      </div>

      {/* COMPACT SEARCH & FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2 transition-colors">
        <div className="flex items-center gap-2">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
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

      {/* LIST TRANSAKSI */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/60 overflow-hidden transition-colors">
        {loading ? (
          <div className="py-12 flex flex-col justify-center items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
            <span>Memuat transaksi...</span>
          </div>
        ) : filteredTx.length === 0 ? (
          <div className="py-12 text-center space-y-1 px-4">
            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Tidak ada transaksi</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Coba gunakan kata kunci pencarian lain atau ubah filter.
            </p>
          </div>
        ) : (
          filteredTx.map((tx) => {
            const isIncome = String(tx.type).toUpperCase() === 'INCOME';
            const isTransfer = String(tx.type).toUpperCase() === 'TRANSFER';

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="p-3 sm:p-3.5 flex justify-between items-center cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition group active:bg-slate-100/50 dark:active:bg-slate-800"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
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
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {tx.description || tx.notes || (isTransfer ? 'Transfer Antar Dompet' : 'Transaksi')}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
                      {isTransfer
                        ? `${tx.wallet?.name} ➔ ${tx.destinationWallet?.name}`
                        : tx.wallet?.name || 'Dompet'}{' '}
                      • {formatDate(tx.date || tx.createdAt)}
                    </p>
                  </div>
                </div>

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
          })
        )}
      </div>

      {/* PAGINATION CONTROLLER */}
      {!loading && paginationMeta.totalPages > 1 && (
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between text-xs font-extrabold transition-colors">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
            {(currentPage - 1) * paginationMeta.limit + 1} - {Math.min(currentPage * paginationMeta.limit, paginationMeta.totalItems)} dari {paginationMeta.totalItems}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95 border border-slate-200/50 dark:border-slate-700/50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2.5 py-1 bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 rounded-lg text-[11px] border dark:border-slate-700">
              {currentPage}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.totalPages))}
              disabled={currentPage === paginationMeta.totalPages}
              className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95 border border-slate-200/50 dark:border-slate-700/50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
          setCurrentPage(1);
          setIsFilterOpen(false);
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