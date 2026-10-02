'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings, ChevronRight, LogOut } from 'lucide-react';
import UserCard from '@/components/profile/UserCard';
import MenuNavigation from '@/components/profile/MenuNavigation';

export default function MenuHubPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

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

      {/* PENGATURAN AKUN & LOGOUT */}
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