'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/ui/Header';
import BottomNav from '@/components/ui/BottomNav';
import api from '@/lib/api';

// DYNAMIC IMPORT MODAL TRANSAKSI (Memangkas ~250KB JS Unused)
const TransactionModal = dynamic(
  () => import('@/components/modals/TransactionModal'),
  { ssr: false }
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showTxModal, setShowTxModal] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);

  const fetchWallets = async () => {
    try {
      const res = await api.get('/wallets');
      setWallets(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <div className="flex-1 flex flex-col relative pb-24">
      <Header />

      {/* LANDMARK SEMANTIK MAIN */}
      <main className="flex-1">{children}</main>

      {/* DYNAMIC MODAL */}
      {showTxModal && (
        <TransactionModal
          isOpen={showTxModal}
          onClose={() => setShowTxModal(false)}
          onSuccess={() => {
            fetchWallets();
            window.location.reload();
          }}
          wallets={wallets}
        />
      )}

      <BottomNav onOpenTxModal={() => setShowTxModal(true)} />
    </div>
  );
}