'use client';

import { useState } from 'react';
import api from '@/lib/api';

export default function WalletModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('BANK');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/wallets', {
        name,
        balance: parseFloat(balance),
        type,
        color: '#16A085',
      });
      setName('');
      setBalance('');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membuat dompet baru');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-100">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900">Tambah Dompet Baru</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Dompet</label>
            <input
              type="text"
              required
              placeholder="Contoh: Bank BCA, Cash, Gopay"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A085]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Saldo Awal (Rp)</label>
            <input
              type="number"
              required
              placeholder="0"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A085]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Dompet</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16A085]"
            >
              <option value="BANK">BANK</option>
              <option value="CASH">CASH</option>
              <option value="E_WALLET">E-WALLET</option>
              <option value="INVESTMENT">INVESTMENT</option>
            </select>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-[#0F3D34] text-white text-xs font-bold rounded-xl hover:bg-[#16A085] transition disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}