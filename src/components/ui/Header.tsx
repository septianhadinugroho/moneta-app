'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const avatarUrl = user?.avatar || user?.picture;

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 transition-colors duration-200">
      <div className="w-full px-4 h-14 flex items-center justify-between">
        
        {/* LOGO MONETA */}
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <Image
            src="/icon-512x512.png"
            alt="Moneta Logo"
            width={28}
            height={28}
            className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
            priority
          />
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base">Moneta</span>
        </Link>

        {/* UTILITY ACTIONS */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />

          <Link 
            href="/dashboard/profile" 
            aria-label="Profil Pengguna"
            className="flex items-center"
          >
            {avatarUrl && !imgError ? (
              <Image
                src={avatarUrl}
                alt={user?.name || 'User Avatar'}
                width={28}
                height={28}
                onError={() => setImgError(true)}
                className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}