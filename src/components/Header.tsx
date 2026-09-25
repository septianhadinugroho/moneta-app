'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, User, LogOut } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const avatarUrl = user?.avatar || user?.picture;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* LOGO MONETA */}
        <Link href="/dashboard" className="flex items-center space-x-2.5 group">
          <img
            src="/icon-512x512.png"
            alt="Moneta Logo"
            className="w-9 h-9 object-contain group-hover:scale-105 transition transform"
          />
          <span className="font-extrabold text-slate-900 tracking-tight text-lg">Moneta</span>
        </Link>

        {/* NAVIGATION DESKTOP & USER ACTION */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <Link
              href="/dashboard"
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                pathname === '/dashboard'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                pathname === '/dashboard/profile'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profil</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
            <Link href="/dashboard/profile" className="flex items-center space-x-2">
              {avatarUrl && !imgError ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || 'User'}
                  onError={() => setImgError(true)}
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}