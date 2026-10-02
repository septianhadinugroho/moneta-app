'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Wallet, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CreditCard,
  ArrowUp,
  Target,
  FileText,
  ArrowRightLeft,
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // DETEKSI TEMA & AUTO REDIRECT JIKA SUDAH LOGIN
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }

    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      
      {/* GLOWING MESH BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-80 bg-emerald-300/30 dark:bg-emerald-900/20 blur-[110px] pointer-events-none rounded-full animate-pulse" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b80_1px,transparent_1px),linear-gradient(to_bottom,#1e293b80_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* FIXED NAVBAR HEADER (TERKUNCI DI DALAM CONTAINER MOBILE DESKTOP) */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-x border-b border-slate-200/80 dark:border-slate-800 px-4 py-2.5 transition-colors">
        <div className="w-full flex justify-between items-center">
          {/* BRAND LOGO */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 relative shrink-0 transition-transform group-hover:scale-105">
              <Image 
                src="/icon-512x512.png" 
                alt="Moneta Logo" 
                width={32} 
                height={32} 
                className="object-contain"
                priority 
                onError={(e) => {
                  e.currentTarget.src = "/favicon.ico";
                }}
              />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Moneta</span>
          </div>

          {/* AKSI: COBA GRATIS -> THEME TOGGLE */}
          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="px-3.5 py-1.5 text-xs font-extrabold bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl shadow-md shadow-slate-900/10 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Coba Gratis
            </Link>

            {/* TOMBOL SWITCH TEMA (DI POJOK KANAN) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition active:scale-95 cursor-pointer"
              title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full px-4 pt-20 pb-8 text-center space-y-4 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-full text-[10px] font-extrabold shadow-xs transition-all hover:border-emerald-400">
          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Kelola Keuangan Pribadi Lebih Rapi</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
          Arus Kas Terkontrol, Finansial Makin <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300 dark:decoration-emerald-700 decoration-wavy decoration-2">Tenang</span>
        </h1>

        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          Pantau dompet, atur limit anggaran, wujudkan target impian, hingga ekspor laporan PDF resmi dalam satu aplikasi.
        </p>

        <div className="pt-1 flex flex-col gap-2">
          <Link
            href="/auth"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Mulai Catat Keuangan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="w-full py-2.5 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs rounded-xl transition shadow-xs hover:shadow-sm"
          >
            Pelajari Fitur
          </a>
        </div>

        {/* PREVIEW CARD */}
        <div className="pt-3">
          <div className="p-1.5 bg-white/80 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl backdrop-blur-md hover:shadow-2xl hover:border-emerald-300 dark:hover:border-emerald-900/60 transition-all duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 space-y-3 text-left">
              
              {/* WARNING BUDGET PREVIEW */}
              <div className="p-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 rounded-xl flex items-center justify-between text-[10px] text-amber-900 dark:text-amber-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="truncate">Jajan terpakai 80% dari limit</span>
                </div>
                <span className="font-extrabold text-amber-700 dark:text-amber-400 shrink-0 text-[9px] bg-amber-100 dark:bg-amber-900/80 px-1.5 py-0.5 rounded-md">Peringatan</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Saldo Bersih</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">Rp 14.250.000</p>
                </div>
                <div className="p-2.5 bg-linear-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/80 shadow-xs">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              {/* STATS ROW */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 rounded-xl transition-transform hover:scale-[1.02]">
                  <p className="text-[9px] font-extrabold text-emerald-800 dark:text-emerald-400">Pemasukan</p>
                  <p className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 mt-0.5">+Rp 8.500.000</p>
                </div>
                <div className="p-2 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 rounded-xl transition-transform hover:scale-[1.02]">
                  <p className="text-[9px] font-extrabold text-rose-800 dark:text-rose-400">Pengeluaran</p>
                  <p className="text-[11px] font-black text-rose-700 dark:text-rose-300 mt-0.5">-Rp 2.150.000</p>
                </div>
              </div>

              {/* BUDGET PROGRESS INDICATOR PREVIEW */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Target className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Anggaran Jajan & Hiburan</span>
                  </span>
                  <span className="font-black text-amber-600 dark:text-amber-400">80%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 dark:bg-amber-400 h-full rounded-full w-[80%]" />
                </div>
              </div>

              {/* TRANSACTIONS LIST */}
              <div className="space-y-1.5 pt-0.5">
                <p className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transaksi Terbaru</p>
                
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-[11px] hover:bg-slate-100/80 dark:hover:bg-slate-800 transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Gaji Utama</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">BCA • Hari ini</p>
                    </div>
                  </div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">+Rp 8.500.000</span>
                </div>

                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-[11px] hover:bg-slate-100/80 dark:hover:bg-slate-800 transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Transfer ke Mandiri</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">Top Up Tabungan</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-700 dark:text-slate-300">Rp 1.000.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 py-8 px-4 bg-white dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="w-full space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Keunggulan Utama Moneta</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Fitur terpadu untuk fleksibilitas arus kas harian kamu.</p>
          </div>

          <div className="space-y-3">
            {/* FEATURE 1 */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group">
              <div className="p-2.5 bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-400 rounded-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">Multi Rekening & Dompet</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-snug mt-0.5">
                  Pisahkan saldo kas tunai, rekening bank, hingga e-wallet secara akurat dan terisolasi.
                </p>
              </div>
            </div>

            {/* FEATURE 2 */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">Transfer Antar Dompet</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-snug mt-0.5">
                  Pindahkan saldo antar akun tanpa merusak statistik beban pengeluaran riil bulanan.
                </p>
              </div>
            </div>

            {/* FEATURE 3 */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group">
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">Target Tabungan & Impian</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-snug mt-0.5">
                  Tetapkan target finansial seperti liburan, gadget, atau dana darurat dan pantau progresnya.
                </p>
              </div>
            </div>

            {/* FEATURE 4 */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 rounded-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">Anggaran Bulanan & Peringatan Limit</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-snug mt-0.5">
                  Tetapkan batas maksimal belanja per kategori dan dapatkan notifikasi saat mendekati limit.
                </p>
              </div>
            </div>

            {/* FEATURE 5 */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group">
              <div className="p-2.5 bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 rounded-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">Ekspor Laporan PDF & Email</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-snug mt-0.5">
                  Pratinjau laporan resmi berlogo Moneta, unduh PDF, atau kirimkan otomatis ke email kamu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-6 px-4 text-center border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-2 transition-colors">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Keamanan & Data Terenkripsi</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          Moneta &copy; {new Date().getFullYear()} • Kelola Keuangan Pribadi Lebih Mudah
        </p>
      </footer>

      {/* FLOATING SCROLL-TO-TOP BUTTON (DIPOSISIKAN DI DALAM FRAME MOBILE) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-5 left-[calc(50%+140px)] -translate-x-1/2 z-50 p-3 bg-slate-900/90 dark:bg-slate-800/90 hover:bg-slate-900 dark:hover:bg-slate-700 text-white rounded-full shadow-xl border border-slate-700/50 backdrop-blur-md transition-all transform active:scale-90 animate-in fade-in zoom-in duration-200 cursor-pointer"
          title="Kembali ke Atas"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}