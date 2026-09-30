'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { X, Trash2, Wallet, Tag, Calendar, Clock, Edit2 } from 'lucide-react';
import api from '@/lib/api';
import ConfirmModal from '@/components/modals/ConfirmModal';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onSuccess?: () => void;
  onEditClick?: (tx: any) => void;
}

export default function TransactionDetailModal({
  isOpen,
  onClose,
  transaction,
  onSuccess,
  onEditClick,
}: TransactionDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen || !transaction) return null;

  const isIncome = String(transaction.type).toUpperCase() === 'INCOME';

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/transactions/${transaction.id}`);
      setShowConfirm(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus transaksi');
    } finally {
      setLoading(false);
    }
  };

  const rawDate = transaction.date || transaction.transactionDate || transaction.createdAt;
  const txDate = rawDate ? new Date(rawDate) : new Date();

  const formattedDate = txDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime =
    txDate.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-5 border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-150">
          
          {/* HEADER MODAL */}
          <div className="flex justify-between items-center">
            <span
              className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full tracking-wider uppercase border ${
                isIncome
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isIncome ? 'Pemasukan' : 'Pengeluaran'}
            </span>
            
            {/* TOMBOL SILANG TEGAS */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition"
              title="Tutup Modal"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* JUDUL & NOMINAL */}
          <div className="text-center space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 truncate px-2">
              {transaction.category?.name || transaction.description || 'Transaksi'}
            </h3>
            <div className="bg-slate-50 py-3 px-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Nominal Transaksi
              </p>
              <p
                className={`text-2xl font-black mt-0.5 tracking-tight ${
                  isIncome ? 'text-emerald-600' : 'text-slate-900'
                }`}
              >
                {isIncome ? '+' : '-'}{formatRupiah(transaction.amount)}
              </p>
            </div>
          </div>

          {/* DETAIL ROW */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2 text-slate-500 font-medium">
                <Wallet className="w-4 h-4 text-slate-400" /> Sumber Dompet
              </span>
              <span className="font-extrabold text-slate-900">
                {transaction.wallet?.name || 'Dompet'}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2 text-slate-500 font-medium">
                <Tag className="w-4 h-4 text-slate-400" /> Kategori
              </span>
              <span className="font-extrabold text-slate-900">
                {transaction.category?.name || transaction.description || 'Lain-lain'}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2 text-slate-500 font-medium">
                <Calendar className="w-4 h-4 text-slate-400" /> Tanggal Catat
              </span>
              <span className="font-extrabold text-slate-900">{formattedDate}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span className="flex items-center gap-2 text-slate-500 font-medium">
                <Clock className="w-4 h-4 text-slate-400" /> Waktu
              </span>
              <span className="font-extrabold text-slate-900">{formattedTime}</span>
            </div>

            <div className="py-2.5 border-b border-slate-100 text-xs space-y-1">
              <span className="text-slate-500 font-medium block">Catatan</span>
              <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 wrap-break-word leading-relaxed">
                {transaction?.notes || transaction?.description || 'Tidak ada catatan.'}
              </p>
            </div>
          </div>

          {/* AKSI: HAPUS DI KIRI, EDIT DI KANAN */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setShowConfirm(true)}
              className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-2xl transition border border-rose-200/80 flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>

            {onEditClick ? (
              <button
                onClick={() => onEditClick(transaction)}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl transition flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            ) : (
              <button
                disabled
                className="py-2.5 bg-slate-50 text-slate-300 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 cursor-not-allowed"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Transaksi?"
        message="Transaksi ini akan dihapus permanen dan saldo dompet akan disesuaikan kembali."
        loading={loading}
      />
    </>
  );
}