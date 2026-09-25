'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import api from '@/lib/api';

export default function RecentTx({
  transactions,
  onOpenModal,
  onRefresh,
}: {
  transactions: any[];
  onOpenModal: () => void;
  onRefresh: () => void;
}) {
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const handleDeleteTx = async (id: number) => {
    if (confirm('Hapus transaksi ini? Saldo dompet akan otomatis dikembalikan (rollback).')) {
      try {
        await api.delete(`/transactions/${id}`);
        setSelectedTx(null);
        onRefresh();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Gagal menghapus transaksi');
      }
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-extrabold text-slate-900">Transaksi Terakhir</h2>
        <button
          onClick={onOpenModal}
          className="flex items-center space-x-1 text-xs font-bold text-[#0F3D34] bg-slate-100 hover:bg-[#0F3D34] hover:text-white px-3 py-1.5 rounded-xl transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Catat Transaksi</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {!transactions || transactions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Belum ada aktivitas transaksi.</p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="py-3 flex justify-between items-center hover:bg-slate-50 px-2 rounded-xl cursor-pointer transition"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    tx.type === 'INCOME' ? 'bg-emerald-50 text-[#16A085]' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {tx.type === 'INCOME' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {tx.description || tx.category?.name}
                  </p>
                  <p className="text-[10px] font-medium text-slate-400">
                    {tx.wallet?.name} • {new Date(tx.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`text-xs font-black ${
                    tx.type === 'INCOME' ? 'text-[#16A085]' : 'text-slate-900'
                  }`}
                >
                  {tx.type === 'INCOME' ? '+' : '-'}{formatRupiah(tx.amount)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DETAIL TRANSAKSI */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900">Detail Transaksi</h3>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Tipe:</span>
                <span className={`font-bold ${selectedTx.type === 'INCOME' ? 'text-[#16A085]' : 'text-rose-600'}`}>
                  {selectedTx.type}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Nominal:</span>
                <span className="font-extrabold text-slate-900">{formatRupiah(selectedTx.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Dompet:</span>
                <span className="font-bold text-slate-800">{selectedTx.wallet?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Kategori:</span>
                <span className="font-bold text-slate-800">{selectedTx.category?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 font-semibold">Tanggal:</span>
                <span className="font-medium text-slate-800">{new Date(selectedTx.date).toLocaleString('id-ID')}</span>
              </div>
              {selectedTx.description && (
                <div className="py-1">
                  <span className="text-slate-500 font-semibold block mb-1">Catatan:</span>
                  <p className="p-2.5 bg-slate-50 rounded-xl text-slate-700 font-medium">{selectedTx.description}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => handleDeleteTx(selectedTx.id)}
                className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}