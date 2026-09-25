'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0F3D34] text-white flex items-center justify-center font-black text-lg shadow-sm">
            M
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-base">Moneta</span>
        </Link>

        {/* NAVIGATION DESKTOP & USER ACTION */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
            <Link
              href="/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                pathname === '/dashboard'
                  ? 'bg-[#0F3D34] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </Link>
            <Link
              href="/dashboard/profile"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                pathname === '/dashboard/profile'
                  ? 'bg-[#0F3D34] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Profil
            </Link>
          </div>

          {/* USER AVATAR & LOGOUT */}
          <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
            <div className="w-8 h-8 rounded-full bg-[#16A085]/20 text-[#0F3D34] font-bold text-xs flex items-center justify-center border border-[#16A085]/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Keluar / Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}