'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { User as UserIcon } from 'lucide-react';

interface ProfileFormProps {
  user: any;
  isGoogleUser: boolean;
  onProfileUpdated: (updatedUser: any) => void;
  onRequestEmailOtp: (pendingEmail: string) => void;
}

export default function ProfileForm({ user, isGoogleUser, onProfileUpdated, onRequestEmailOtp }: ProfileFormProps) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await api.put('/auth/profile', { name, email });

      if (res.data.requiresEmailVerification) {
        onRequestEmailOtp(res.data.pendingEmail);
        setMessage('Silakan masukkan kode OTP yang dikirim ke email baru kamu.');
      } else {
        setMessage(res.data.message);
        onProfileUpdated({ ...user, name });
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Pembaruan profil gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
      <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
        <UserIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
        Pengaturan Profil
      </h2>

      {message && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl font-medium leading-relaxed">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800 transition font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Email</label>
          <input
            type="email"
            required
            disabled={isGoogleUser}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3.5 py-2.5 border rounded-xl text-xs transition font-medium ${
              isGoogleUser
                ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 cursor-not-allowed'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700/80 focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800'
            }`}
          />
          {isGoogleUser && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Email dikelola oleh Google Sign-In dan tidak dapat diubah di sini.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl transition disabled:opacity-50 flex items-center shadow-xs cursor-pointer active:scale-95"
        >
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white dark:text-slate-900 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          Simpan Profil
        </button>
      </form>
    </div>
  );
}