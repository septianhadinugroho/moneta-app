'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, KeyRound, Send, Check } from 'lucide-react';
import api from '@/lib/api';

interface ForgotPasswordFormProps {
  onSuccessReset: () => void;
  onError: (msg: string) => void;
}

export default function ForgotPasswordForm({ onSuccessReset, onError }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // STEP 1: SEND RESET CODE
  const handleSendResetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      return setErrors({ email: 'Masukkan email terdaftar kamu' });
    } else if (!validateEmail(email)) {
      return setErrors({ email: 'Format email tidak valid' });
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.resetToken) setResetToken(res.data.resetToken);
      setStep('verify');
    } catch (err: any) {
      onError(err.response?.data?.message || 'Gagal mengirim kode reset');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY CODE
  const handleVerifyResetOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) return setErrors({ otpCode: 'Masukkan 6 digit kode OTP' });
    setStep('reset');
  };

  // STEP 3: RESET PASSWORD
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!password) newErrors.password = 'Kata sandi baru wajib diisi';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok';

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token: resetToken || otpCode,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });
      onSuccessReset();
    } catch (err: any) {
      onError(err.response?.data?.message || 'Gagal mereset kata sandi');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'request') {
    return (
      <form onSubmit={handleSendResetOTP} noValidate className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Email Terdaftar</label>
          <div className="relative group">
            <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({});
              }}
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl font-medium text-slate-900 transition-all ${
                errors.email ? 'bg-rose-50/60 border border-rose-500' : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:bg-white'
              }`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-rose-600 font-extrabold mt-1 animate-in fade-in">{errors.email}</p>}
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md shadow-slate-900/10 transition-all flex items-center justify-center gap-2 group">
          <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          <span>{loading ? 'Kirim...' : 'Kirim Kode Verifikasi'}</span>
        </button>
      </form>
    );
  }

  if (step === 'verify') {
    return (
      <form onSubmit={handleVerifyResetOTP} className="space-y-4 text-xs">
        <div>
          <div className="flex items-center justify-center gap-1.5 text-slate-700 font-bold mb-2">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <span>Kode OTP 6 Digit</span>
          </div>
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={otpCode}
            onChange={(e) => {
              setOtpCode(e.target.value);
              if (errors.otpCode) setErrors({});
            }}
            className={`w-full px-3 py-3 rounded-xl text-center text-xl tracking-[0.4em] font-mono text-slate-900 transition-all ${
              errors.otpCode ? 'bg-rose-50/60 border border-rose-500' : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:bg-white'
            }`}
          />
          {errors.otpCode && <p className="text-[11px] text-rose-600 font-extrabold mt-1 text-center animate-in fade-in">{errors.otpCode}</p>}
        </div>
        <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md shadow-slate-900/10 transition-all">
          Lanjutkan
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-3.5 text-xs">
      <div>
        <label className="block font-bold text-slate-700 mb-1">Kata Sandi Baru</label>
        <div className="relative group">
          <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({});
            }}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl font-medium text-slate-900 transition-all ${
              errors.password ? 'bg-rose-50/60 border border-rose-500' : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:bg-white'
            }`}
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition">
            {showPass ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-[11px] text-rose-600 font-extrabold mt-1 animate-in fade-in">{errors.password}</p>}
      </div>

      <div>
        <label className="block font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
        <div className="relative group">
          <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type={showConfirmPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({});
            }}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl font-medium text-slate-900 transition-all ${
              errors.confirmPassword ? 'bg-rose-50/60 border border-rose-500' : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:bg-white'
            }`}
          />
          <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition">
            {showConfirmPass ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-[11px] text-rose-600 font-extrabold mt-1 animate-in fade-in">{errors.confirmPassword}</p>}
      </div>

      <button type="submit" disabled={loading} className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-extrabold text-xs rounded-xl shadow-md shadow-slate-900/10 transition-all flex items-center justify-center gap-2 mt-2">
        <Check className="w-4 h-4 text-emerald-400" />
        <span>{loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}</span>
      </button>
    </form>
  );
}