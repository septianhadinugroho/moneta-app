'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Wallet, 
  TrendingUp, 
  PieChart, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CreditCard,
  ArrowUp
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 1. AUTO REDIRECT JIKA SUDAH LOGIN
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* GLOWING MESH BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[320px] bg-emerald-300/30 blur-[110px] pointer-events-none rounded-full animate-pulse" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* FIXED NAVBAR HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 py-2.5 transition-all">
        <div className="max-w-md mx-auto flex justify-between items-center">
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
            <span className="text-lg font-black tracking-tight text-slate-900">Moneta</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="px-3 py-1.5 text-xs font-extrabold text-slate-600 hover:text-slate-900 transition"
            >
              Masuk
            </Link>
            <Link
              href="/auth"
              className="px-3.5 py-1.5 text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md shadow-slate-900/10 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Coba Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-md w-full mx-auto px-4 pt-20 pb-8 text-center space-y-4 z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-800 rounded-full text-[10px] font-extrabold shadow-2xs transition-all hover:border-emerald-400">
          <Sparkles className="w-3 h-3 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Kelola Keuangan Pribadi Lebih Rapi</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
          Arus Kas Terkontrol, Finansial Makin <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">Tenang</span>
        </h1>

        <p className="text-[11px] font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
          Catat pemasukan & pengeluaran harian dari bank, e-wallet, hingga uang tunai dalam satu dasbor yang ringkas.
        </p>

        <div className="pt-1 flex flex-col gap-2">
          <Link
            href="/auth"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
          >
            <span>Mulai Catat Keuangan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="w-full py-2.5 bg-white/80 hover:bg-white border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition shadow-2xs hover:shadow-xs"
          >
            Pelajari Fitur
          </a>
        </div>

        {/* PREVIEW CARD */}
        <div className="pt-3">
          <div className="p-1.5 bg-white/80 border border-slate-200/90 rounded-3xl shadow-xl backdrop-blur-md hover:shadow-2xl hover:border-emerald-300 transition-all duration-300">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Total Saldo Bersih</p>
                  <p className="text-lg font-black text-slate-900 mt-0.5">Rp 14.250.000</p>
                </div>
                <div className="p-2.5 bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-600 rounded-2xl border border-emerald-200/80 shadow-2xs">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl transition-transform hover:scale-[1.02]">
                  <p className="text-[9px] font-extrabold text-emerald-800">Pemasukan</p>
                  <p className="text-[11px] font-black text-emerald-700 mt-0.5">+Rp 8.500.000</p>
                </div>
                <div className="p-2 bg-rose-50/70 border border-rose-100 rounded-xl transition-transform hover:scale-[1.02]">
                  <p className="text-[9px] font-extrabold text-rose-800">Pengeluaran</p>
                  <p className="text-[11px] font-black text-rose-700 mt-0.5">-Rp 2.150.000</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Transaksi Terbaru</p>
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-[11px] hover:bg-slate-100/80 transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <p className="font-bold text-slate-900">Gaji Bulanan</p>
                      <p className="text-[9px] text-slate-400 font-medium">BCA • Hari ini</p>
                    </div>
                  </div>
                  <span className="font-black text-emerald-600">+Rp 8.500.000</span>
                </div>

                <div className="p-2 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-[11px] hover:bg-slate-100/80 transition">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <div>
                      <p className="font-bold text-slate-900">Beli Kopi & Jajan</p>
                      <p className="text-[9px] text-slate-400 font-medium">SeaBank • Kemarin</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">-Rp 45.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 py-8 px-4 bg-white border-t border-slate-200/80">
        <div className="max-w-md mx-auto space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black text-slate-900">Kenapa Menggunakan Moneta?</h2>
            <p className="text-[11px] text-slate-500 font-medium">Fitur simpel untuk kontrol penuh dana pribadi kamu.</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group">
              <div className="p-2.5 bg-sky-100 text-sky-700 rounded-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">Multi Rekening & Dompet</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                  Kelola dompet tunai, rekening bank, hingga e-wallet dalam satu tampilan terpadu.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">Kategori Warna Kustom</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                  Kelompokkan transaksi dengan indikator warna visual yang mudah dipahami.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex items-start gap-3.5 group">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">Ringkasan Grafik Instan</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                  Visualisasi statistik arus kas otomatis untuk membantu perencanaan anggaran.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-6 px-4 text-center border-t border-slate-200/80 bg-slate-50 space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Keamanan & Data Terenkripsi</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          Moneta &copy; {new Date().getFullYear()} • Kelola Keuangan Pribadi Lebih Mudah
        </p>
      </footer>

      {/* FLOATING SCROLL-TO-TOP BUTTON */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-50 p-3 bg-slate-900/90 hover:bg-slate-900 text-white rounded-full shadow-xl border border-slate-700/50 backdrop-blur-md transition-all transform active:scale-90 animate-in fade-in zoom-in duration-200"
          title="Kembali ke Atas"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

    </div>
  );
}