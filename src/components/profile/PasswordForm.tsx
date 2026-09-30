'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface PasswordFormProps {
  isGoogleUser: boolean;
}

export default function PasswordForm({ isGoogleUser }: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [showCurrPass, setShowCurrPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  if (isGoogleUser) {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">Keamanan</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Akun kamu diautentikasi via Google Sign-In.
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-lg border border-slate-200/60">
          OAuth Active
        </span>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Gagal mengubah kata sandi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
        <Lock className="w-4 h-4 text-slate-700" />
        Ubah Kata Sandi
      </h2>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium leading-relaxed">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
          <div className="relative">
            <input
              type={showCurrPass ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrPass(!showCurrPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md z-10 cursor-pointer"
            >
              {showCurrPass ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Baru</label>
          <div className="relative">
            <input
              type={showNewPass ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md z-10 cursor-pointer"
            >
              {showNewPass ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
          <div className="relative">
            <input
              type={showConfirmNewPass ? 'text' : 'password'}
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md z-10 cursor-pointer"
            >
              {showConfirmNewPass ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center shadow-xs cursor-pointer"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          Perbarui Kata Sandi
        </button>
      </form>
    </div>
  );
}