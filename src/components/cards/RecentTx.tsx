'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatRupiah } from '@/lib/utils';
import { History, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, ChevronRight } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
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
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3 font-sans text-slate-900 dark:text-slate-100 transition-colors">
        <div className="flex justify-between items-center">
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Transaksi Terakhir
          </h2>
          <Link
            href="/dashboard/transactions"
            className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl transition"
          >
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-6 font-medium">
            Belum ada transaksi dicatat.
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {transactions.map((tx: any) => {
              const txType = String(tx.type || '').toUpperCase();
              const isTransfer = txType === 'TRANSFER';
              const isIncome = txType === 'INCOME';
              const catIcon = tx.category?.icon;
              const catColor = tx.category?.color;

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="py-2.5 flex justify-between items-center cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 px-1 rounded-xl transition group"
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
                        className={`p-2 rounded-xl shrink-0 ${
                          isTransfer
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            : isIncome
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
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
                      {/* DESKRIPSI & KATEGORI */}
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {isTransfer
                          ? `Transfer (${tx.wallet?.name || 'Dompet'} ➔ ${tx.destinationWallet?.name || 'Tujuan'})`
                          : tx.category?.name || tx.description || 'Transaksi'}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
                        {isTransfer
                          ? `Transfer Internal • ${formatDate(tx.date || tx.createdAt)}`
                          : `${tx.wallet?.name || 'Dompet'} • ${formatDate(tx.date || tx.createdAt)}`}
                      </p>
                    </div>
                  </div>

                  {/* NOMINAL (SEKARANG EXPENSE WARNA MERAH) */}
                  <div className="flex items-center space-x-1.5 shrink-0 pl-2">
                    <span
                      className={`text-xs font-black whitespace-nowrap ${
                        isTransfer
                          ? 'text-slate-600 dark:text-slate-400'
                          : isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400' // 👈 UBAH WARNA DI SINI JADI MERAH
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