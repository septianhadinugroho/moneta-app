'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings, ChevronRight, LogOut, Download, Smartphone, Code2 } from 'lucide-react';
import UserCard from '@/components/profile/UserCard';
import MenuNavigation from '@/components/profile/MenuNavigation';

// Custom SVG Component untuk Instagram
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

// Custom SVG Component untuk LinkedIn
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function MenuHubPage() {
  const [user, setUser] = useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    const isPwa = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isPwa);

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
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* CARD USER */}
      <UserCard user={user} isGoogleUser={isGoogleUser} />

      {/* FITUR FINANSIAL */}
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

          {/* TOMBOL INSTAL APLIKASI PWA */}
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

          {/* TOMBOL LOGOUT */}
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

      {/* FOOTER INFORMASI VERSI & KONTAK DEVELOPER */}
      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-extrabold">
          <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Moneta App</span>
          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] font-black border dark:border-slate-700">
            v1.2.0
          </span>
        </div>

        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Punya saran atau kendala? Hubungi developer:
        </p>

        {/* SOSIAL MEDIA DEVELOPER */}
        <div className="flex justify-center items-center gap-2">
          <a
            href="https://instagram.com/septianhnr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-200 dark:hover:border-pink-900/50 transition shadow-2xs"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
            <span>septianhnr</span>
          </a>

          <a
            href="https://www.linkedin.com/in/septian-hadi-nugroho"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-200 dark:hover:border-sky-900/50 transition shadow-2xs"
          >
            <LinkedinIcon className="w-3.5 h-3.5 text-sky-500" />
            <span>Septian Hadi Nugroho</span>
          </a>
        </div>
      </div>
    </div>
  );
}