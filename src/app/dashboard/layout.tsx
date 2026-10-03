'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import BottomNav from '@/components/ui/BottomNav';
import TransactionModal from '@/components/modals/TransactionModal';
import api from '@/lib/api';

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

      <main className="flex-1">{children}</main>

      <TransactionModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        onSuccess={() => {
          fetchWallets();
          window.location.reload();
        }}
        wallets={wallets}
      />

      <BottomNav onOpenTxModal={() => setShowTxModal(true)} />
    </div>
  );
}