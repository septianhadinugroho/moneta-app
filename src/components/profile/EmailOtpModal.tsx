'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Mail } from 'lucide-react';

interface EmailOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingEmail: string;
  onSuccess: (updatedUserData: any) => void;
}

export default function EmailOtpModal({ isOpen, onClose, pendingEmail, onSuccess }: EmailOtpModalProps) {
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put('/auth/verify-new-email', {
        newEmail: pendingEmail,
        otpCode,
      });

      onSuccess(res.data.data);
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Verifikasi email gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans text-slate-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100 dark:border-slate-800 shadow-xl animate-in fade-in zoom-in-95 duration-150 transition-colors">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 rounded-full flex items-center justify-center mx-auto mb-2">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Verifikasi Email Baru</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Masukkan 6 digit kode OTP yang dikirim ke <span className="font-bold text-slate-800 dark:text-slate-200">{pendingEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-center text-xl tracking-[0.4em] font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition"
            placeholder="000000"
          />
          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer transition border border-slate-200/60 dark:border-slate-700/60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl transition disabled:opacity-50 cursor-pointer active:scale-95 shadow-xs"
            >
              {loading ? 'Memverifikasi...' : 'Konfirmasi Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}