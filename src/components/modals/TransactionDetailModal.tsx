'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { X, Trash2, Wallet, Tag, Calendar, Clock, Edit2, ArrowDownRight, Info } from 'lucide-react';
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

  const txType = String(transaction.type || '').toUpperCase();
  const isIncome = txType === 'INCOME';
  const isTransfer = txType === 'TRANSFER';

  // DETEKSI TRANSAKSI OTOMATIS SISTEM (TAGIHAN & UTANG/PIUTANG)
  const isSystemManaged =
    transaction?.subscriptionPayment ||
    transaction?.description?.startsWith('Pembayaran Tagihan:') ||
    transaction?.description?.startsWith('Pinjaman') ||
    transaction?.description?.startsWith('Pelunasan piutang') ||
    transaction?.description?.startsWith('Pembayaran utang');

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
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans">
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 space-y-4 border border-slate-100 dark:border-slate-800 shadow-2xl relative animate-in fade-in zoom-in duration-150 text-slate-900 dark:text-slate-100 transition-colors">
          
          {/* HEADER MODAL */}
          <div className="flex justify-between items-center">
            <span
              className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full tracking-wider uppercase border ${
                isTransfer
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  : isIncome
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
              }`}
            >
              {isTransfer ? 'Transfer Internal' : isIncome ? 'Pemasukan' : 'Pengeluaran'}
            </span>
            
            {/* TOMBOL SILANG */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* JUDUL & NOMINAL */}
          <div className="text-center space-y-1">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate px-2">
              {isTransfer
                ? `${transaction.wallet?.name || 'Dompet'} ➔ ${transaction.destinationWallet?.name || 'Tujuan'}`
                : transaction.category?.name || transaction.description || 'Transaksi'}
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/60 py-3 px-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Nominal Transaksi
              </p>
              <p
                className={`text-2xl font-black mt-0.5 tracking-tight ${
                  isTransfer
                    ? 'text-slate-700 dark:text-slate-200'
                    : isIncome
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {isTransfer ? '' : isIncome ? '+' : '-'}{formatRupiah(transaction.amount)}
              </p>
            </div>
          </div>

          {/* DETAIL ROW */}
          <div className="space-y-2.5 text-xs">
            {/* DOMPET ASAL */}
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                <Wallet className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                {isTransfer ? 'Dari Dompet (Asal)' : 'Sumber Dompet'}
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">
                {transaction.wallet?.name || 'Dompet'}
              </span>
            </div>

            {/* JIKA TRANSFER: TAMPILKAN DOMPET TUJUAN */}
            {isTransfer && (
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                  <ArrowDownRight className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  Ke Dompet (Tujuan)
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {transaction.destinationWallet?.name || 'Dompet Tujuan'}
                </span>
              </div>
            )}

            {/* KATEGORI */}
            {!isTransfer && (
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                  <Tag className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Kategori
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {transaction.category?.name || transaction.description || 'Lain-lain'}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Tanggal Catat
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">{formattedDate}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" /> Waktu
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">{formattedTime}</span>
            </div>

            <div className="py-2 border-b border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <span className="text-slate-500 dark:text-slate-400 font-medium block">Catatan</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 break-words leading-relaxed">
                {transaction?.notes || transaction?.description || 'Tidak ada catatan.'}
              </p>
            </div>
          </div>

          {/* AKSI: TAMPILAN SESUAI TIPE TRANSAKSI */}
          {isSystemManaged ? (
            <div className="space-y-2">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 rounded-xl flex items-start gap-2 text-[10px] text-amber-800 dark:text-amber-300 font-bold">
                <Info className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <span>
                  Transaksi ini dikelola otomatis oleh sistem (Tagihan / Utang). Edit nominal dilakukan melalui menu dasbor terkait.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-2xl transition border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Transaksi & Batalkan Record</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="py-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-2xl transition border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>

              {onEditClick ? (
                <button
                  type="button"
                  onClick={() => onEditClick(transaction)}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl transition flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer active:scale-95"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="py-2.5 bg-slate-50 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Transaksi?"
        message="Transaksi ini akan dihapus permanen, saldo dompet dan status terikat akan disesuaikan kembali."
        loading={loading}
      />
    </>
  );
}