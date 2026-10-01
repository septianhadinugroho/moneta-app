'use client';

import { useState, useEffect } from 'react';
import { X, Target, Calendar, Wallet as WalletIcon } from 'lucide-react';
import api from '@/lib/api';
import CustomDropdown from '@/components/ui/CustomDropdown';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: any;
  wallets: any[];
  onSuccess: () => void;
}

export default function GoalModal({ isOpen, onClose, goalToEdit, wallets, onSuccess }: GoalModalProps) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [walletId, setWalletId] = useState('');
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goalToEdit) {
      setName(goalToEdit.name || '');
      setTargetAmount(String(goalToEdit.targetAmount || ''));
      setTargetDate(goalToEdit.targetDate ? goalToEdit.targetDate.split('T')[0] : '');
      setWalletId(String(goalToEdit.walletId || ''));
    } else {
      setName('');
      setTargetAmount('');
      setTargetDate('');
      setWalletId('');
    }
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const walletOptions = wallets.map((w) => ({
    id: String(w.id),
    name: `${w.name} (Saldo: Rp ${Number(w.balance).toLocaleString('id-ID')})`,
    color: w.color || '#10b981',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount) return alert('Lengkapi data impian');

    setLoading(true);
    try {
      const payload = {
        name,
        targetAmount: Number(targetAmount),
        targetDate: targetDate || null,
        walletId: walletId ? Number(walletId) : null,
      };

      if (goalToEdit) {
        await api.put(`/goals/${goalToEdit.id}`, payload);
      } else {
        await api.post('/goals', payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan impian');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black text-slate-900">
              {goalToEdit ? 'Edit Target Impian' : 'Tambah Impian Baru'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-extrabold mb-1">Nama Impian</label>
            <input
              type="text"
              placeholder="Misal: Beli Laptop Baru, Dana Darurat"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-extrabold mb-1">Target Nominal (Rp)</label>
            <input
              type="number"
              placeholder="15000000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden"
            />
          </div>

          <CustomDropdown
            label="Sumber Dompet Alokasi (Opsional)"
            isOpen={isWalletDropdownOpen}
            onToggle={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
            selectedOption={walletOptions.find((w) => w.id === walletId)}
            options={walletOptions}
            onSelect={(id) => { setWalletId(id); setIsWalletDropdownOpen(false); }}
            placeholder="Pilih Dompet"
            defaultIcon={WalletIcon}
          />

          <div>
            <label className="block text-slate-700 font-extrabold mb-1">Tenggat Waktu (Opsional)</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition text-xs shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
          >
            {loading ? 'Menyimpan...' : 'Simpan Target Impian'}
          </button>
        </form>
      </div>
    </div>
  );
}