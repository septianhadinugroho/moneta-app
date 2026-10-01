'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import SummaryCards from '@/components/cards/SummaryCards';
import RecentTx from '@/components/cards/RecentTx';
import ExpenseChart from '@/components/cards/ExpenseChart';
import BudgetWarningBanner from '@/components/ui/BudgetWarningBanner';
import QuickAccess from '@/components/ui/QuickAccess';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      // Fetch Summary & Budget Data secara parallel
      const [summaryRes, budgetRes] = await Promise.all([
        api.get('/dashboard/summary', {
          params: { month: currentMonth, year: currentYear },
        }),
        api.get('/budgets', {
          params: { month: currentMonth, year: currentYear },
        }),
      ]);

      setData(summaryRes.data.data || summaryRes.data || {});
      setBudgets(budgetRes.data.data || []);
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err);
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

  const totalNetWorth = data?.totalNetWorth || 0;
  const monthlySummary = data?.monthlySummary || { income: 0, expense: 0 };
  const recentTransactions = data?.recentTransactions || [];

  return (
    <div className="p-4 sm:p-5 space-y-4 pb-20 font-sans text-slate-900">
      {/* 1. DANGER ZONE / BUDGET WARNING BANNER */}
      <BudgetWarningBanner budgets={budgets} />

      {/* 2. SUMMARY CARDS */}
      <SummaryCards
        totalNetWorth={totalNetWorth}
        monthlySummary={monthlySummary}
        period={data?.period}
      />

      {/* 3. QUICK ACCESS FITUR */}
      <QuickAccess user={data?.user} />

      {/* 4. TRANSAKSI TERAKHIR */}
      <RecentTx
        transactions={recentTransactions}
        onRefresh={fetchDashboardData}
      />

      {/* 5. CHART KATEGORI */}
      {(data?.expenseCategoryBreakdown || data?.incomeCategoryBreakdown) && (
        <ExpenseChart
          expenseCategories={data.expenseCategoryBreakdown || []}
          incomeCategories={data.incomeCategoryBreakdown || []}
        />
      )}
    </div>
  );
}