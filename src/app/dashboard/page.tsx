'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Header from '@/components/Header';
import SummaryCards from '@/components/cards/SummaryCards';
import WalletList from '@/components/cards/WalletList';
import RecentTx from '@/components/cards/RecentTx';
import ExpenseChart from '@/components/cards/ExpenseChart';
import BottomNav from '@/components/BottomNav';
import WalletModal from '@/components/WalletModal';
import TransactionModal from '@/components/TransactionModal';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, walletRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/wallets'),
      ]);
      setSummary(summaryRes.data.data);
      setWallets(walletRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F3D34]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 sm:pb-8">
      {/* HEADER DESKTOP & MOBILE */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        <SummaryCards summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WalletList
              wallets={wallets}
              onOpenModal={() => setShowWalletModal(true)}
              onRefresh={fetchDashboardData}
            />
            <RecentTx
              transactions={summary?.recentTransactions}
              onOpenModal={() => setShowTxModal(true)}
              onRefresh={fetchDashboardData}
            />
          </div>
          <div>
            <ExpenseChart categories={summary?.categoryBreakdown} />
          </div>
        </div>
      </main>

      {/* MODALS */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onSuccess={fetchDashboardData}
      />
      <TransactionModal
        isOpen={showTxModal}
        onClose={() => setShowTxModal(false)}
        onSuccess={fetchDashboardData}
        wallets={wallets}
      />

      {/* BOTTOM NAVIGATION FOR MOBILE */}
      <BottomNav />
    </div>
  );
}