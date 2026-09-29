'use client';

import { useState, useEffect } from 'react';
import { X, Wallet, CreditCard, Landmark, Banknote, Nfc } from 'lucide-react';
import api from '@/lib/api';
import ColorPicker from '@/components/ui/ColorPicker';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletToEdit?: any;
  onSuccess: () => void;
}

const WALLET_TYPES = [
  { value: 'BANK', label: 'Bank', icon: Landmark },
  { value: 'E_WALLET', label: 'E-Wallet', icon: CreditCard },
  { value: 'E_MONEY', label: 'E-Money', icon: Nfc },
  { value: 'CASH', label: 'Tunai', icon: Banknote },
];

export default function WalletModal({
  isOpen,
  onClose,
  walletToEdit,
  onSuccess,
}: WalletModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('BANK');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState('#0f172a');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletToEdit) {
      setName(walletToEdit.name || '');
      setType(walletToEdit.type || 'BANK');
      setBalance(walletToEdit.balance?.toString() || '0');
      setColor(walletToEdit.color || '#0f172a');
    } else {
      setName('');
      setType('BANK');
      setBalance('');
      setColor('#0f172a');
    }
  }, [walletToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Nama dompet wajib diisi');

    setLoading(true);
    try {
      if (walletToEdit) {
        await api.put(`/wallets/${walletToEdit.id}`, {
          name,
          type,
          color,
          balance: parseFloat(balance || '0'),
        });
      } else {
        await api.post('/wallets', {
          name,
          type,
          color,
          balance: parseFloat(balance || '0'),
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan dompet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-150">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-600" />
            {walletToEdit ? 'Edit Dompet' : 'Tambah Dompet Baru'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-600 font-bold mb-1">Nama Dompet / Rekening</label>
            <input
              type="text"
              placeholder="Misal: BCA Utama, SeaBank, Flazz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">Tipe Dompet</label>
            <div className="grid grid-cols-4 gap-1.5">
              {WALLET_TYPES.map((t) => {
                const IconComponent = t.icon;
                const isSelected = type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`py-2 px-1 rounded-xl border font-bold flex flex-col items-center gap-1 transition ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-[9px] truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">
              {walletToEdit ? 'Saldo Saat Ini' : 'Saldo Awal'}
            </label>
            <input
              type="number"
              placeholder="0"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <ColorPicker
            selectedColor={color}
            onChange={(newColor) => setColor(newColor)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition text-xs shadow-xs"
          >
            {loading ? 'Menyimpan...' : walletToEdit ? 'Perbarui Dompet' : 'Simpan Dompet'}
          </button>
        </form>
      </div>
    </div>
  );
}