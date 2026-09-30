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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100 shadow-xl">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">Verifikasi Email Baru</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Masukkan 6 digit kode OTP yang dikirim ke <span className="font-bold text-slate-800">{pendingEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl tracking-[0.4em] font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            placeholder="000000"
          />
          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Memverifikasi...' : 'Konfirmasi Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}