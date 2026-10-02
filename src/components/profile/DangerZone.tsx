'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ConfirmModal from '@/components/modals/ConfirmModal';
import { Trash2 } from 'lucide-react';

export default function DangerZone() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.delete('/auth/account');
      localStorage.clear();
      router.push('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus akun');
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-rose-100 dark:border-rose-900/40 shadow-xs flex items-center justify-between transition-colors">
        <div>
          <h3 className="text-xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Hapus Akun</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Hapus akun dan data finansial secara permanen.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl transition border border-rose-200/80 dark:border-rose-900/60 flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus</span>
        </button>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Apakah kamu yakin?"
        description="Tindakan ini tidak dapat dibatalkan. Seluruh data pribadi, dompet, dan transaksi kamu akan dihapus permanen."
        confirmLabel="Ya, Hapus Akun"
        variant="danger"
        loading={loading}
      />
    </>
  );
}