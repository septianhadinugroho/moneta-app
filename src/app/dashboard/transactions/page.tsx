'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { Search, ArrowUpRight, ArrowDownLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import TransactionDetailModal from '@/components/modals/TransactionDetailModal';
import EditTransactionModal from '@/components/modals/EditTransactionModal';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');
  
  // State Modal
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [editingTx, setEditingTx] = useState<any>(null);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (rawDate: string) => {
    if (!rawDate) return '';
    const d = new Date(rawDate);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredTx = transactions.filter((tx) => {
    const name = (tx.category?.name || tx.description || '').toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesType =
      typeFilter === 'ALL' || String(tx.type).toUpperCase() === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 space-y-4">
      {/* HEADER PAGE */}
      <div className="flex justify-between items-center">
        <h1 className="text-base sm:text-lg font-black text-slate-900">Riwayat Transaksi</h1>
        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-full border border-slate-200/60">
          {filteredTx.length} Transaksi
        </span>
      </div>

      {/* FILTER & SEARCH MODERN */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {/* INPUT SEARCH */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari deskripsi atau kategori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden focus:ring-2 focus:ring-slate-900 transition"
          />
        </div>

        {/* PILL SEGMENTED FILTER */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/80 rounded-xl text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setTypeFilter('ALL')}
            className={`py-1.5 rounded-lg transition text-[11px] ${
              typeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('EXPENSE')}
            className={`py-1.5 rounded-lg transition text-[11px] ${
              typeFilter === 'EXPENSE'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter('INCOME')}
            className={`py-1.5 rounded-lg transition text-[11px] ${
              typeFilter === 'INCOME'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pemasukan
          </button>
        </div>
      </div>

      {/* LIST TRANSAKSI */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredTx.length === 0 ? (
          <div className="py-12 text-center space-y-1">
            <p className="text-xs font-extrabold text-slate-700">Transaksi tidak ditemukan</p>
            <p className="text-[11px] text-slate-400 font-medium">
              Coba cari kata kunci lain atau ubah filter tipe transaksi.
            </p>
          </div>
        ) : (
          filteredTx.map((tx) => {
            const isIncome = String(tx.type).toUpperCase() === 'INCOME';
            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="p-3.5 flex justify-between items-center cursor-pointer hover:bg-slate-50/80 transition group"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-4.5 h-4.5" />
                    ) : (
                      <ArrowDownLeft className="w-4.5 h-4.5" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {tx.category?.name || tx.description || 'Transaksi'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                      {tx.wallet?.name || 'Dompet'} • {formatDate(tx.date || tx.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 pl-2">
                  <span
                    className={`text-xs font-black whitespace-nowrap ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL DETAIL TRANSAKSI */}
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

      {/* MODAL EDIT TRANSAKSI */}
      <EditTransactionModal
        isOpen={Boolean(editingTx)}
        onClose={() => setEditingTx(null)}
        transaction={editingTx}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}