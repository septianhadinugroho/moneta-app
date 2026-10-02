'use client';

import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';
import api from '@/lib/api';

interface RegisterFormProps {
  onSuccess: (emailSent: string) => void;
  onError: (msg: string) => void;
}

export default function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format email belum valid (contoh: nama@email.com)';
    }
    if (!password) newErrors.password = 'Kata sandi wajib diisi';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, confirmPassword });
      onSuccess(email);
    } catch (err: any) {
      onError(err.response?.data?.message || 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} noValidate className="space-y-3.5 text-xs font-sans">
      {/* NAMA LENGKAP */}
      <div>
        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
        <div className="relative group">
          <User className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type="text"
            placeholder="Misal: Septian Hadi"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: '' }));
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all ${
              errors.name
                ? 'bg-rose-50/60 dark:bg-rose-950/40 border border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800'
            }`}
          />
        </div>
        {errors.name && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold mt-1 animate-in fade-in">{errors.name}</p>}
      </div>

      {/* EMAIL */}
      <div>
        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
        <div className="relative group">
          <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: '' }));
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all ${
              errors.email
                ? 'bg-rose-50/60 dark:bg-rose-950/40 border border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800'
            }`}
          />
        </div>
        {errors.email && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold mt-1 animate-in fade-in">{errors.email}</p>}
      </div>

      {/* KATA SANDI */}
      <div>
        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kata Sandi</label>
        <div className="relative group">
          <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: '' }));
            }}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all ${
              errors.password
                ? 'bg-rose-50/60 dark:bg-rose-950/40 border border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800'
            }`}
          />
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)} 
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition cursor-pointer"
          >
            {showPass ? <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold mt-1 animate-in fade-in">{errors.password}</p>}
      </div>

      {/* KONFIRMASI KATA SANDI */}
      <div>
        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Kata Sandi</label>
        <div className="relative group">
          <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type={showConfirmPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: '' }));
            }}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all ${
              errors.confirmPassword
                ? 'bg-rose-50/60 dark:bg-rose-950/40 border border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-800'
            }`}
          />
          <button 
            type="button" 
            onClick={() => setShowConfirmPass(!showConfirmPass)} 
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 transition cursor-pointer"
          >
            {showConfirmPass ? <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold mt-1 animate-in fade-in">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-xs rounded-xl transition-all shadow-md shadow-slate-900/10 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 group cursor-pointer"
      >
        <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span>{loading ? 'Mendaftarkan...' : 'Daftar Akun Baru'}</span>
      </button>
    </form>
  );
}