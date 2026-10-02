'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings, ChevronRight, LogOut, Download, Smartphone } from 'lucide-react';
import UserCard from '@/components/profile/UserCard';
import MenuNavigation from '@/components/profile/MenuNavigation';

export default function MenuHubPage() {
  const [user, setUser] = useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    // 1. Cek apakah aplikasi sudah berjalan dalam mode PWA/Standalone
    const isPwa = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isPwa);

    // 2. Tangkap event prompt instalasi PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('Aplikasi Moneta sudah terpasang atau browser Anda tidak mendukung instalasi otomatis.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/auth';
  };

  const isGoogleUser = Boolean(user?.avatar || user?.googleId);

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 pb-28 transition-colors">
      {/* CARD USER */}
      <UserCard user={user} isGoogleUser={isGoogleUser} />

      {/* FITUR FINANSIAL (MENU NAVIGATION COMPONENT) */}
      <div className="space-y-2">
        <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
          Fitur Finansial
        </p>
        <MenuNavigation user={user} />
      </div>

      {/* PENGATURAN AKUN, INSTAL PWA & LOGOUT */}
      <div className="space-y-2 pt-2">
        <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
          Pengaturan & Keamanan
        </p>

        <div className="space-y-2">
          {/* EDIT PROFIL & KATA SANDI */}
          <Link
            href="/dashboard/profile"
            className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition shadow-2xs group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">Edit Profil & Kata Sandi</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Ubah nama, email, dan password</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* TOMBOL INSTAL APLIKASI PWA (HANYA MUNCUL JIKA BELUM INSTAL/STANDALONE) */}
          {!isStandalone && (
            <button
              type="button"
              onClick={handleInstallPWA}
              className="w-full flex items-center justify-between p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl hover:bg-emerald-100/60 dark:hover:bg-emerald-950/40 transition text-left group cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">Instal Aplikasi Moneta</p>
                    <span className="px-1.5 py-0.2 text-[8px] font-black bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-md">
                      PWA
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-600/80 dark:text-emerald-500/80 font-medium">Pasang di layar utama HP untuk akses instan</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
            </button>
          )}

          {/* TOMBOL LOGOUT / KELUAR AKUN */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 rounded-2xl hover:bg-rose-100/60 dark:hover:bg-rose-950/40 transition text-left group cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-rose-600 dark:text-rose-400">Keluar Akun</p>
                <p className="text-[10px] text-rose-400 dark:text-rose-500/80 font-medium">Selesaikan sesi dan keluar dari aplikasi</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400 dark:text-rose-500 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}