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

  // State & handler untuk Dark Mode
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Deteksi mode tema yang sedang aktif dari class html
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
      
      {/* 1. MESH GRADIENT & GRID OVERLAY WITH PULSE ANIMATION */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-87.5 bg-emerald-200/40 dark:bg-emerald-900/20 blur-[120px] pointer-events-none rounded-full animate-pulse" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b80_1px,transparent_1px),linear-gradient(to_bottom,#1e293b80_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* HEADER NAVIGASI (KIRI: BERANDA | KANAN: THEME TOGGLE) */}
      <div className="relative z-10 max-w-sm w-full mx-auto flex items-center justify-between pt-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs active:scale-95 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Beranda</span>
        </Link>

        {/* TOMBOL SWITCH TEMA (LIGHT / DARK) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md rounded-full border border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all active:scale-95 cursor-pointer"
          title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>
      </div>

      {/* 2. CARD CONTAINER AUTH */}
      <div className="relative z-10 w-full max-w-sm mx-auto my-auto space-y-4 animate-in fade-in zoom-in-95 duration-300">
        
        {/* LOGO & BRANDING MONETA */}
        <div className="flex flex-col items-center justify-center text-center space-y-1.5">
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-10 h-10 relative shrink-0 transition-transform duration-300 group-hover:scale-110">
              <Image 
                src="/icon-512x512.png" 
                alt="Moneta Logo" 
                width={40} 
                height={40} 
                className="object-contain"
                priority 
                onError={(e) => {
                  e.currentTarget.src = "/favicon.ico";
                }}
              />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Moneta</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Kelola Keuangan Pribadi Jadi Lebih Mudah
          </p>
        </div>

        {/* GLASS CARD UTAMA */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-6 space-y-4 transition-all hover:border-emerald-200 dark:hover:border-emerald-900/50">
          
          {/* TOGGLE TAB MASUK & DAFTAR */}
          {(mode === 'login' || mode === 'register') && (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl text-xs font-extrabold relative transition-colors">
              <button
                type="button"
                onClick={() => { setMode('login'); clearAlerts(); }}
                className={`py-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                  mode === 'login' 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md shadow-slate-900/10' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); clearAlerts(); }}
                className={`py-2 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                  mode === 'register' 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md shadow-slate-900/10' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Daftar
              </button>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="text-center pt-1 animate-in fade-in slide-in-from-top-1">
              <h2 className="text-sm font-black text-slate-900 dark:text-white">Lupa Kata Sandi</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Masukkan email terdaftar kamu</p>
            </div>
          )}

          {mode === 'otp' && (
            <div className="text-center pt-1 animate-in fade-in slide-in-from-top-1">
              <h2 className="text-sm font-black text-slate-900 dark:text-white">Verifikasi Email</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Masukkan kode OTP yang dikirim ke <span className="font-bold text-slate-800 dark:text-slate-200">{targetEmail}</span></p>
            </div>
          )}

          {/* ALERTS */}
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs rounded-xl font-bold animate-in fade-in duration-200">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs rounded-xl font-bold animate-in fade-in duration-200">
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 px-3.5 py-1.5 rounded-full active:scale-95 group cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Kembali ke Masuk</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 3. FOOTER */}
      <footer className="relative z-10 text-center space-y-1.5 my-2">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          <span>Keamanan & Data Terenkripsi</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          Moneta &copy; {new Date().getFullYear()} • Kelola Keuangan Jadi Mudah
        </p>
      </footer>
    </main>
  );
}