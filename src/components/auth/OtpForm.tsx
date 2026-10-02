'use client';

import { useState } from 'react';
import { KeyRound, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

interface OtpFormProps {
  email: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export default function OtpForm({ email, onSuccess, onError }: OtpFormProps) {
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setError('Masukkan 6 digit kode OTP');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otpCode });
      onSuccess();
    } catch (err: any) {
      onError(err.response?.data?.message || 'Kode OTP salah atau sudah kadaluarsa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs font-sans">
      <div>
        <div className="flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold mb-2">
          <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Kode OTP 6 Digit</span>
        </div>
        <input
          type="text"
          maxLength={6}
          placeholder="000000"
          value={otpCode}
          onChange={(e) => {
            setOtpCode(e.target.value);
            if (error) setError('');
          }}
          className={`w-full px-3 py-3 rounded-xl text-center text-xl tracking-[0.4em] font-mono text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all ${
            error
              ? 'bg-rose-50/60 dark:bg-rose-950/40 border border-rose-500 ring-1 ring-rose-500'
              : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800'
          }`}
        />
        {error && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold mt-1 text-center animate-in fade-in">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-md shadow-slate-900/10 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 group-hover:scale-110 transition-transform" />
        <span>{loading ? 'Verifikasi...' : 'Verifikasi Email'}</span>
      </button>
    </form>
  );
}