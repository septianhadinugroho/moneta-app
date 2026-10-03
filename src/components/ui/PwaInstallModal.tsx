'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Download, X, Smartphone } from 'lucide-react';

export default function PwaInstallModal() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Tangkap prompt jika sudah pernah tertangkap di window
    if ((window as any).deferredPwaPrompt) {
      setDeferredPrompt((window as any).deferredPwaPrompt);
      checkAndShowModal();
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPwaPrompt = e;
      setDeferredPrompt(e);
      checkAndShowModal();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [pathname]);

  const checkAndShowModal = () => {
    // Tampilkan hanya jika di halaman landing page /
    if (pathname !== '/') return;

    const lastDismissed = localStorage.getItem('pwa_install_dismissed_at');
    if (lastDismissed) {
      const daysPassed = (Date.now() - Number(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysPassed < 7) return;
    }

    setShowModal(true);
  };

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).deferredPwaPrompt;
    if (!promptEvent) return;

    // Sembunyikan modal buatan kita dulu agar pengguna fokus ke dialog browser
    setShowModal(false);

    // Picu dialog bawaan Chrome/Android
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;

    if (outcome === 'accepted') {
      localStorage.removeItem('pwa_install_dismissed_at');
      (window as any).deferredPwaPrompt = null;
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    localStorage.setItem('pwa_install_dismissed_at', String(Date.now()));
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 relative font-sans text-slate-900 dark:text-slate-100 transform animate-in slide-in-from-bottom-5 duration-300">
        
        {/* TOMBOL TUTUP */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition cursor-pointer"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER MODAL */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-12 h-12 relative shrink-0 p-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl shadow-xs">
            <Image
              src="/icon-192x192.png"
              alt="Moneta App Icon"
              width={48}
              height={48}
              className="object-contain rounded-xl"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">Moneta App</span>
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 rounded-md">
                PWA
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Aplikasi Keuangan Pribadi
            </p>
          </div>
        </div>

        {/* PENJELASAN SINGKAT */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-1.5 text-xs">
          <div className="flex items-center gap-2 font-extrabold text-slate-800 dark:text-slate-200">
            <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Instal ke Layar Utama</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Akses aplikasi lebih cepat seperti aplikasi native tanpa perlu lewat browser.
          </p>
        </div>

        {/* AKSI BUTTON */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Pasang Aplikasi Sekarang</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold text-[11px] transition cursor-pointer"
          >
            Nanti Saja
          </button>
        </div>

      </div>
    </div>
  );
}