'use client';

import { formatRupiah } from '@/lib/utils';
import api from '@/lib/api';

export default function WalletList({
  wallets,
  onOpenModal,
  onRefresh,
}: {
  wallets: any[];
  onOpenModal: () => void;
  onRefresh: () => void;
}) {
  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Yakin ingin menghapus dompet "${name}"? Seluruh transaksi terkait dompet ini juga akan terhapus.`)) {
      try {
        await api.delete(`/wallets/${id}`);
        onRefresh();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Gagal menghapus dompet');
      }
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-[#0F3D34]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Dompet & Rekening
        </h2>
        <button
          onClick={onOpenModal}
          className="flex items-center space-x-1 text-xs font-bold text-white bg-[#0F3D34] hover:bg-[#16A085] px-3 py-1.5 rounded-xl transition shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {!wallets || wallets.length === 0 ? (
          <p className="text-xs text-slate-400 col-span-2 text-center py-4">Belum ada dompet ditambahkan.</p>
        ) : (
          wallets.map((w) => (
            <div
              key={w.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex justify-between items-center group relative hover:border-slate-300 transition"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500">{w.name}</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">
                  {formatRupiah(w.balance)}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] tracking-wider font-extrabold px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[#0F3D34]">
                  {w.type}
                </span>
                <button
                  onClick={() => handleDelete(w.id, w.name)}
                  className="p-1 text-slate-300 hover:text-rose-600 transition"
                  title="Hapus Dompet"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}