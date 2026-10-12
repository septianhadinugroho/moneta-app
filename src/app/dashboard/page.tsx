'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import SummaryCards from '@/components/cards/SummaryCards';
import RecentTx from '@/components/cards/RecentTx';
import BudgetWarningBanner from '@/components/ui/BudgetWarningBanner';
import SubscriptionWarningBanner from '@/components/ui/SubscriptionWarningBanner';
import QuickAccess from '@/components/ui/QuickAccess';

// DYNAMIC IMPORT CHART (Hanya di-download saat halaman dirender, menghemat ~300KB JS)
const ExpenseChart = dynamic(() => import('@/components/cards/ExpenseChart'), {
  ssr: false,
  loading: () => (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 h-48 animate-pulse flex items-center justify-center">
      <span className="text-xs font-semibold text-slate-400">Memuat grafik...</span>
    </div>
  ),
});

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('Selamat Datang');
  const [formattedToday, setFormattedToday] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const [summaryRes, budgetRes] = await Promise.all([
        api.get('/dashboard/summary', {
          params: { month: currentMonth, year: currentYear },
        }),
        api.get('/budgets', {
          params: { month: currentMonth, year: currentYear },
        }),
      ]);

      const summaryData = summaryRes.data.data || summaryRes.data || {};
      setData(summaryData);
      setBudgets(budgetRes.data.data || []);

      if (summaryData?.user?.name) {
        setUserName(summaryData.user.name);
      }
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) setUserName(parsed.name);
      } catch (e) {
        console.error(e);
      }
    }

    const now = new Date();
    const hour = now.getHours();

    if (hour >= 0 && hour < 4) setGreeting('Selamat Dini Hari');
    else if (hour >= 4 && hour < 11) setGreeting('Selamat Pagi');
    else if (hour >= 11 && hour < 15) setGreeting('Selamat Siang');
    else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');

    setFormattedToday(
      now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      })
    );

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
        <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300">Memuat data dasbor...</span>
      </div>
    );
  }

  const totalNetWorth = data?.totalNetWorth || 0;
  const monthlySummary = data?.monthlySummary || { income: 0, expense: 0 };
  const recentTransactions = data?.recentTransactions || [];
  const firstName = userName ? userName.trim().split(' ')[0] : '';

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. GREETING & DATE HEADER (High-Contrast Text) */}
      <div className="flex items-center justify-between px-0.5">
        <div>
          <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {greeting}{firstName ? `, ${firstName}` : ''} 👋
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 font-semibold">
            Ringkasan keuangan kamu hari ini
          </p>
        </div>
        {formattedToday && (
          <span className="px-2.5 py-1 bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-[10px] font-extrabold border border-slate-300 dark:border-slate-700">
            {formattedToday}
          </span>
        )}
      </div>

      {/* 2. BANNER PENGINGAT TAGIHAN RUTIN */}
      <SubscriptionWarningBanner onRefresh={fetchDashboardData} />

      {/* 3. BUDGET WARNING BANNER */}
      <BudgetWarningBanner budgets={budgets} />

      {/* 4. SUMMARY CARDS */}
      <SummaryCards
        totalNetWorth={totalNetWorth}
        monthlySummary={monthlySummary}
        period={data?.period}
      />

      {/* 5. QUICK ACCESS FITUR */}
      <QuickAccess user={data?.user} />

      {/* 6. TRANSAKSI TERAKHIR */}
      <RecentTx
        transactions={recentTransactions}
        onRefresh={fetchDashboardData}
      />

      {/* 7. CHART KATEGORI (DYNAMICALLY LOADED) */}
      {(data?.expenseCategoryBreakdown || data?.incomeCategoryBreakdown) && (
        <ExpenseChart
          expenseCategories={data.expenseCategoryBreakdown || []}
          incomeCategories={data.incomeCategoryBreakdown || []}
          period={data?.period}
          onPeriodChange={async (month, year) => {
            try {
              const res = await api.get('/dashboard/summary', { params: { month, year } });
              setData(res.data.data || res.data || {});
            } catch (err) {
              console.error('Gagal mengubah periode grafik:', err);
            }
          }}
        />
      )}
    </div>
  );
}