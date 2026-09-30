'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, ArrowRight, Mail, Lock, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';

interface LoginFormProps {
  onForgotPassword: () => void;
  onError: (msg: string) => void;
}

export default function LoginForm({ onForgotPassword, onError }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format email belum lengkap (contoh: nama@email.com)';
    }

    if (!password) {
      newErrors.password = 'Kata sandi wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      router.push('/dashboard');
    } catch (err: any) {
      onError(err.response?.data?.message || 'Email atau kata sandi salah.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google', {
        idToken: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      router.push('/dashboard');
    } catch (err: any) {
      onError(err.response?.data?.message || 'Gagal masuk dengan Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} noValidate className="space-y-4 text-xs">
      
      {/* EMAIL FIELD */}
      <div>
        <label className="block font-bold text-slate-700 mb-1">Email</label>
        <div className="relative group">
          <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: '' }));
            }}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl font-medium text-slate-900 transition-all ${
              errors.email
                ? 'bg-rose-50/60 border border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:bg-white'
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-[11px] text-rose-600 font-extrabold mt-1 animate-in fade-in">
            {errors.email}
          </p>
        )}
      </div>

      {/* PASSWORD FIELD */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="font-bold text-slate-700">Kata Sandi</label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[11px] font-bold text-emerald-600 hover:underline"
          >
            Lupa kata sandi?
          </button>
        </div>
        <div className="relative group">
          <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: '' }));
            }}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl font-medium text-slate-900 transition-all ${
              errors.password
                ? 'bg-rose-50/60 border border-rose-500 ring-1 ring-rose-500'
                : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:bg-white'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition"
          >
            {showPass ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[11px] text-rose-600 font-extrabold mt-1 animate-in fade-in">
            {errors.password}
          </p>
        )}
      </div>

      {/* BUTTON WITH MICRO INTERACTION */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-slate-900/10 disabled:opacity-50 flex items-center justify-center gap-2 mt-2 group"
      >
        {loading ? 'Memproses...' : 'Masuk ke Moneta'}
        {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>

      {/* DIVIDER */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-extrabold">
          <span className="bg-white/90 px-3 text-slate-400">Atau masuk dengan</span>
        </div>
      </div>

      {/* GOOGLE SIGN-IN */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => onError('Gagal OAuth Google')}
          shape="rectangular"
          theme="outline"
        />
      </div>

      {/* TRUST BADGE */}
      <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Koneksi & Data Terenkripsi Aman</span>
      </div>
    </form>
  );
}