'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import SummaryCards from '@/components/cards/SummaryCards';
import RecentTx from '@/components/cards/RecentTx';
import ExpenseChart from '@/components/cards/ExpenseChart';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      setSummary(res.data.data);
    } catch (err) {
      // Error handling diam tanpa mencetak log sensitif di browser
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 space-y-4">
      <SummaryCards summary={summary} />

      <RecentTx
        transactions={summary?.recentTransactions || []}
        onRefresh={fetchDashboardData}
      />

      <ExpenseChart
        expenseCategories={summary?.expenseCategoryBreakdown || []}
        incomeCategories={summary?.incomeCategoryBreakdown || []}
      />
    </div>
  );
}