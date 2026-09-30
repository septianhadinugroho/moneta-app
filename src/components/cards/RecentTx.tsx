'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatRupiah } from '@/lib/utils';
import { History, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, ChevronRight } from 'lucide-react';
import TransactionDetailModal from '@/components/modals/TransactionDetailModal';
import EditTransactionModal from '@/components/modals/EditTransactionModal';

export default function RecentTx({
  transactions = [],
  onRefresh,
}: {
  transactions?: any[];
  onRefresh?: () => void;
}) {
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [editingTx, setEditingTx] = useState<any>(null);

  const formatDate = (rawDate: string) => {
    if (!rawDate) return '';
    const d = new Date(rawDate);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 font-sans text-slate-900">
        <div className="flex justify-between items-center">
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            Transaksi Terakhir
          </h2>
          <Link
            href="/dashboard/transactions"
            className="text-[11px] font-extrabold text-slate-600 hover:text-slate-900 flex items-center gap-0.5 bg-slate-100 px-2.5 py-1 rounded-xl transition"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6 font-medium">
            Belum ada transaksi dicatat.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((tx: any) => {
              const txType = String(tx.type || '').toUpperCase();
              const isTransfer = txType === 'TRANSFER';
              const isIncome = txType === 'INCOME';

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="py-2.5 flex justify-between items-center cursor-pointer hover:bg-slate-50/80 px-1 rounded-xl transition group"
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    {/* IKON DIBEDAKAN SESUAI TIPE TRANSAKSI */}
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isTransfer
                          ? 'bg-slate-100 text-slate-600'
                          : isIncome
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
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
                      {/* DESKRIPSI & KATEGORI */}
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {isTransfer
                          ? `Transfer (${tx.wallet?.name || 'Dompet'} ➔ ${tx.destinationWallet?.name || 'Tujuan'})`
                          : tx.category?.name || tx.description || 'Transaksi'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        {isTransfer
                          ? `Transfer Internal • ${formatDate(tx.date || tx.createdAt)}`
                          : `${tx.wallet?.name || 'Dompet'} • ${formatDate(tx.date || tx.createdAt)}`}
                      </p>
                    </div>
                  </div>

                  {/* NOMINAL DENGAN FORMAT NETRAL UNTUK TRANSFER */}
                  <div className="flex items-center space-x-1.5 shrink-0 pl-2">
                    <span
                      className={`text-xs font-black whitespace-nowrap ${
                        isTransfer
                          ? 'text-slate-600'
                          : isIncome
                          ? 'text-emerald-600'
                          : 'text-slate-900'
                      }`}
                    >
                      {isTransfer ? '' : isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      <TransactionDetailModal
        isOpen={Boolean(selectedTx)}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
        onSuccess={onRefresh}
        onEditClick={(tx) => {
          setSelectedTx(null);
          setEditingTx(tx);
        }}
      />

      {/* MODAL EDIT */}
      <EditTransactionModal
        isOpen={Boolean(editingTx)}
        onClose={() => setEditingTx(null)}
        transaction={editingTx}
        onSuccess={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </>
  );
}