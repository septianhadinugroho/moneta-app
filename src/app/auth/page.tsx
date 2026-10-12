'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Sun, Moon } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import OtpForm from '@/components/auth/OtpForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'otp' | 'forgot';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [targetEmail, setTargetEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const clearAlerts = () => {
    setError('');
    setMessage('');
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      
      {/* BACKGROUND DEKORATIF */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-80 bg-emerald-300/30 dark:bg-emerald-900/20 blur-[120px] pointer-events-none rounded-full transform-gpu" />

      {/* HEADER NAVIGASI */}
      <div className="relative z-10 max-w-sm w-full mx-auto flex items-center justify-between pt-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs active:scale-95 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Beranda</span>
        </Link>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          className="p-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 shadow-xs transition-all active:scale-95 cursor-pointer"
          title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>

      {/* CARD CONTAINER AUTH */}
      <div className="relative z-10 w-full max-w-sm mx-auto my-auto space-y-4">
        
        {/* LOGO & BRANDING */}
        <div className="flex flex-col items-center justify-center text-center space-y-1.5">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 relative shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image 
                src="/icon-512x512.png" 
                alt="Moneta Logo" 
                width={40} 
                height={40} 
                className="object-contain"
                priority 
              />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Moneta</span>
          </div>
          {/* KONTRAS TEKS PERBAIKAN: text-slate-600 & text-slate-300 */}
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Kelola Keuangan Pribadi Jadi Lebih Mudah
          </p>
        </div>

        {/* GLASS CARD UTAMA */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          
          {/* TAB MASUK & DAFTAR */}
          {(mode === 'login' || mode === 'register') && (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-extrabold relative">
              <button
                type="button"
                onClick={() => { setMode('login'); clearAlerts(); }}
                className={`py-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                  mode === 'login' 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); clearAlerts(); }}
                className={`py-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                  mode === 'register' 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Daftar
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="text-center pt-1">
              <h2 className="text-sm font-black text-slate-900 dark:text-white">Lupa Kata Sandi</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Masukkan email terdaftar kamu</p>
            </div>
          )}

          {mode === 'otp' && (
            <div className="text-center pt-1">
              <h2 className="text-sm font-black text-slate-900 dark:text-white">Verifikasi Email</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">Masukkan kode OTP yang dikirim ke <span className="font-bold text-slate-900 dark:text-slate-100">{targetEmail}</span></p>
            </div>
          )}

          {/* ALERTS */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs rounded-xl font-bold">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl font-bold">
              {message}
            </div>
          )}

          {/* FORMS */}
          {mode === 'login' && (
            <LoginForm
              onForgotPassword={() => { setMode('forgot'); clearAlerts(); }}
              onError={(msg) => setError(msg)}
            />
          )}

          {mode === 'register' && (
            <RegisterForm
              onSuccess={(email) => {
                setTargetEmail(email);
                setMessage('Kode verifikasi dikirim ke email kamu!');
                setMode('otp');
              }}
              onError={(msg) => setError(msg)}
            />
          )}

          {mode === 'otp' && (
            <OtpForm
              email={targetEmail}
              onSuccess={() => {
                setMessage('Email berhasil diverifikasi! Silakan masuk.');
                setMode('login');
              }}
              onError={(msg) => setError(msg)}
            />
          )}

          {mode === 'forgot' && (
            <ForgotPasswordForm
              onSuccessReset={() => {
                setMessage('Kata sandi berhasil diubah! Silakan masuk.');
                setMode('login');
              }}
              onError={(msg) => setError(msg)}
            />
          )}

          {/* TOMBOL KEMBALI */}
          {mode !== 'login' && mode !== 'register' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setMode('login'); clearAlerts(); }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-1.5 rounded-full active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Masuk</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 text-center space-y-1.5 my-2">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Keamanan & Data Terenkripsi</span>
        </div>
        <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
          Moneta &copy; {new Date().getFullYear()} • Kelola Keuangan Jadi Mudah
        </p>
      </footer>
    </main>
  );
}