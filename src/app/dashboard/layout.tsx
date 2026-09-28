'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import TransactionModal from '@/components/TransactionModal';
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
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative border-x border-slate-200 pb-20">
        <Header />

        <main>{children}</main>

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
    </div>
  );
}