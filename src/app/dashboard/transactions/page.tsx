'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ConfirmModal from '@/components/ConfirmModal';
import { formatRupiah } from '@/lib/utils';
import { Search, ArrowUpRight, ArrowDownLeft, Filter, Trash2 } from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [walletFilter, setWalletFilter] = useState<string>('ALL');

  // Selected for Delete
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      const [txRes, walletRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/wallets'),
      ]);
      setTransactions(txRes.data.data || []);
      setWallets(walletRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDeleteTx = async () => {
    if (!selectedTx) return;
    setActionLoading(true);
    try {
      await api.delete(`/transactions/${selectedTx.id}`);
      setSelectedTx(null);
      fetchTransactions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus transaksi');
    } finally {
      setActionLoading(false);
    }
  };

  // Logic Filtering
  const filteredTx = transactions.filter((tx) => {
    const matchSearch =
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      tx.category?.name?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || tx.type === typeFilter;
    const matchWallet = walletFilter === 'ALL' || String(tx.walletId) === String(walletFilter);
    return matchSearch && matchType && matchWallet;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 sm:pb-8">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-base sm:text-lg font-black text-slate-900">Riwayat Transaksi</h1>
          <span className="text-xs font-bold text-slate-500">{filteredTx.length} Transaksi</span>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {/* Tipe Filter */}
            <select
              value={typeFilter}
              onChange={(e: any) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">Semua Tipe</option>
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>

            {/* Dompet Filter */}
            <select
              value={walletFilter}
              onChange={(e) => setWalletFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">Semua Dompet / Rekening</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TRANSACTION LIST */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredTx.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">Tidak ada transaksi ditemukan.</p>
          ) : (
            filteredTx.map((tx) => (
              <div
                key={tx.id}
                className="p-4 flex justify-between items-center hover:bg-slate-50 transition"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {tx.type === 'INCOME' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">
                      {tx.description || tx.category?.name}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {tx.wallet?.name} • {new Date(tx.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`text-xs font-black ${
                      tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}{formatRupiah(tx.amount)}
                  </span>
                  <button
                    onClick={() => setSelectedTx(tx)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 transition rounded-lg"
                    title="Hapus Transaksi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        onConfirm={handleDeleteTx}
        title="Hapus Transaksi?"
        description={`Nominal ${formatRupiah(selectedTx?.amount || 0)} (${selectedTx?.type}) dari dompet ${selectedTx?.wallet?.name}. Saldo dompet akan dikembalikan secara otomatis.`}
        confirmLabel="Hapus Transaksi"
        variant="danger"
        loading={actionLoading}
      />

      <BottomNav />
    </div>
  );
}