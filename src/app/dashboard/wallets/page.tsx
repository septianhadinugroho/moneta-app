'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import {
  Wallet,
  Plus,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Landmark,
  CreditCard,
  Nfc,
  Banknote,
  Edit2,
  Trash2,
} from 'lucide-react';
import WalletModal from '@/components/modals/WalletModal';
import TransferModal from '@/components/modals/TransferModal';
import VirtualWalletCard from '@/components/cards/VirtualWalletCard';

export default function WalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [relatedTransactions, setRelatedTransactions] = useState<any[]>([]);
  const [fetchingTx, setFetchingTx] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // STATE & REF UNTUK DOT INDICATORS & CAROUSEL
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const fetchWallets = async () => {
    try {
      const res = await api.get('/wallets');
      setWallets(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // FUNGSI MENDETEKSI KARTU YANG SEDANG AKTIF DI TENGAH LAYAR
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild?.getBoundingClientRect().width || 280;
    const gap = 12; // Gap antarkartu
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(newIndex);
  };

  // FUNGSI KLIK DOT UNTUK SCROLL KE KARTU SPESIFIK
  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const cardWidth = container.firstElementChild?.getBoundingClientRect().width || 280;
    const gap = 12;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth',
    });
  };

  const totalBalance = wallets.reduce((acc, curr) => acc + Number(curr.balance || 0), 0);

  const handleOpenCreate = () => {
    setSelectedWallet(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (wallet: any) => {
    setSelectedWallet(wallet);
    setIsModalOpen(true);
  };

  const handleInitiateDelete = async (wallet: any) => {
    setDeleteTarget(wallet);
    setFetchingTx(true);
    try {
      const res = await api.get('/transactions', { params: { walletId: wallet.id } });
      setRelatedTransactions(res.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil riwayat transaksi', err);
      setRelatedTransactions([]);
    } finally {
      setFetchingTx(false);
    }
  };

  const confirmDeleteWallet = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await api.delete(`/wallets/${deleteTarget.id}`);
      setDeleteTarget(null);
      setRelatedTransactions([]);
      fetchWallets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus dompet');
    } finally {
      setIsDeleting(false);
    }
  };

  const getWalletIcon = (type: string) => {
    switch (String(type || '').toUpperCase()) {
      case 'BANK': return <Landmark className="w-4 h-4" />;
      case 'E_WALLET': return <CreditCard className="w-4 h-4" />;
      case 'E_MONEY': return <Nfc className="w-4 h-4" />;
      default: return <Banknote className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HEADER NET WORTH */}
      <div className="bg-slate-900 dark:bg-slate-900/90 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden space-y-3 border border-slate-800 transition-colors">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate">
              TOTAL KEKAYAAN (NET WORTH)
            </span>
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded-lg transition shrink-0 border border-slate-700/80 active:scale-95 cursor-pointer"
            >
              {showBalance ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>

          <span className="text-[10px] font-extrabold bg-slate-800/80 text-emerald-400 px-2.5 py-1 rounded-full border border-slate-700/80 whitespace-nowrap shrink-0">
            {wallets.length} Akun
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
          {showBalance ? formatRupiah(totalBalance) : '••••••••'}
        </h2>

        {/* QUICK ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setIsTransferModalOpen(true)}
            disabled={wallets.length < 2}
            className="py-2 px-3 bg-slate-800/90 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700/60 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transfer</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-3" />
            <span>Tambah Dompet</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: CAROUSEL VIRTUAL CARDS (SNAP + DOTS) */}
      <div className="space-y-2.5 pt-1">
        <div className="flex justify-between items-center px-0.5">
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kartu Virtual</span>
          </h3>
          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500">
            {wallets.length > 0 ? `${activeIndex + 1} dari ${wallets.length}` : '0 Akun'}
          </span>
        </div>

        {wallets.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-center transition-colors">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Belum ada dompet terhubung.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* CAROUSEL HORIZONTAL CONTAINER */}
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex gap-3 overflow-x-auto pt-1 px-0.5 snap-x snap-mandatory custom-scrollbar scroll-smooth"
            >
              {wallets.map((w) => (
                <VirtualWalletCard
                  key={w.id}
                  wallet={w}
                  showBalance={showBalance}
                  onEdit={handleOpenEdit}
                  onDelete={handleInitiateDelete}
                />
              ))}
            </div>

            {/* DOT INDICATORS INTERAKTIF */}
            {wallets.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {wallets.map((w, idx) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => scrollToCard(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === idx
                        ? 'w-6 bg-emerald-500 dark:bg-emerald-400'
                        : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                    }`}
                    title={`Pindah ke ${w.name}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: COMPACT LIST DI BAWAH CAROUSEL */}
      {wallets.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-0.5">
            Ringkasan Saldo Akun
          </h4>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden shadow-2xs">
            {wallets.map((w, idx) => (
              <div
                key={w.id}
                onClick={() => scrollToCard(idx)}
                className={`p-3 flex items-center justify-between transition cursor-pointer ${
                  activeIndex === idx
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                    style={{ backgroundColor: w.color || '#3b82f6' }}
                  >
                    {getWalletIcon(w.type)}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{w.name}</p>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                      {w.type || 'CASH'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <p className="text-xs font-black font-mono text-slate-900 dark:text-slate-100">
                    {showBalance ? formatRupiah(w.balance) : '••••••••'}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleOpenEdit(w); }}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL CREATION / EDIT WALLET */}
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        walletToEdit={selectedWallet}
        onSuccess={fetchWallets}
      />

      {/* MODAL TRANSFER ANTAR DOMPET */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        wallets={wallets}
        onSuccess={fetchWallets}
      />

      {/* MODAL KONFIRMASI HAPUS DOMPET */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 text-slate-900 dark:text-slate-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Hapus Dompet "{deleteTarget.name}"?</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                  Menghapus dompet ini akan membuang dompet dan <span className="font-bold text-rose-600 dark:text-rose-400">seluruh transaksi di dalamnya secara permanen</span>.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                <span>Transaksi Terdampak:</span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">{relatedTransactions.length} Transaksi</span>
              </div>

              {fetchingTx ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center text-xs text-slate-400 dark:text-slate-500 font-medium animate-pulse">
                  Memuat transaksi terkait...
                </div>
              ) : relatedTransactions.length === 0 ? (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                  Tidak ada transaksi di dompet ini. Aman dihapus.
                </div>
              ) : (
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 dark:border-slate-800 rounded-2xl p-2 bg-slate-50/50 dark:bg-slate-800/30">
                  {relatedTransactions.map((tx) => (
                    <div key={tx.id} className="p-2 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        {tx.type === 'INCOME' ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{tx.description || 'Tanpa Catatan'}</p>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500">{tx.category?.name || 'Lain-lain'}</p>
                        </div>
                      </div>
                      <span className={`font-black text-xs shrink-0 ${tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}{formatRupiah(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => { setDeleteTarget(null); setRelatedTransactions([]); }}
                className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition active:scale-95 cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteWallet}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Hapus...' : 'Ya, Hapus Semua'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}