'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatRupiah } from '@/lib/utils';
import api from '@/lib/api';
import ConfirmModal from '@/components/ConfirmModal';
import { ArrowUpRight, ArrowDownLeft, History, ChevronRight, Trash2, Calendar, Wallet, Tag } from 'lucide-react';

export default function RecentTx({
  transactions,
  onRefresh,
}: {
  transactions: any[];
  onRefresh: () => void;
}) {
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteTx = async () => {
    if (!selectedTx) return;
    setLoading(true);
    try {
      await api.delete(`/transactions/${selectedTx.id}`);
      setShowConfirmDelete(false);
      setSelectedTx(null);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus transaksi');
    } finally {
      setLoading(false);
    }
  };

  const displayList = transactions ? transactions.slice(0, 3) : [];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <History className="w-4 h-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">Transaksi Terakhir</h2>
        </div>

        <Link
          href="/dashboard/transactions"
          className="group flex items-center space-x-1 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-200/60 hover:border-blue-200 transition"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {!displayList || displayList.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6 font-medium">Belum ada aktivitas transaksi.</p>
        ) : (
          displayList.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="py-3 flex justify-between items-center hover:bg-slate-50 px-2.5 -mx-2.5 rounded-xl cursor-pointer transition group"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 transition group-hover:scale-105 ${
                    tx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}
                >
                  {tx.type === 'INCOME' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 truncate max-w-32 sm:max-w-none">
                    {tx.description || tx.category?.name}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                    {tx.wallet?.name} • {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-black tracking-tight ${
                    tx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {tx.type === 'INCOME' ? '+' : '-'}{formatRupiah(tx.amount)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedTx && !showConfirmDelete && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 border border-slate-100 shadow-xl relative">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  selectedTx.type === 'INCOME' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {selectedTx.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 mt-2">
                  {selectedTx.description || selectedTx.category?.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-2 text-center bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Nominal Transaksi</p>
              <p className={`text-xl font-black mt-0.5 ${
                selectedTx.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-900'
              }`}>
                {selectedTx.type === 'INCOME' ? '+' : '-'}{formatRupiah(selectedTx.amount)}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 py-1">
                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                  <Wallet className="w-3.5 h-3.5 text-slate-400" /> Sumber Dompet
                </span>
                <span className="font-bold text-slate-900">{selectedTx.wallet?.name}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 py-1">
                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                  <Tag className="w-3.5 h-3.5 text-slate-400" /> Kategori
                </span>
                <span className="font-bold text-slate-900">{selectedTx.category?.name || '-'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 py-1">
                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Tanggal Catat
                </span>
                <span className="font-bold text-slate-900">
                  {new Date(selectedTx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-rose-200/80"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Hapus Transaksi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteTx}
        title="Konfirmasi Hapus"
        description={`Apakah kamu yakin ingin menghapus transaksi "${selectedTx?.description || selectedTx?.category?.name}" sebesar ${formatRupiah(selectedTx?.amount || 0)}? Saldo dompet akan disesuaikan kembali.`}
        confirmLabel="Ya, Hapus"
        variant="danger"
        loading={loading}
      />
    </div>
  );
}