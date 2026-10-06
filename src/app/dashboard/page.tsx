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

  // State User & Time
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

      // Jika Backend mereturn data user, utamakan nama dari backend
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
    // 1. Inisialisasi Nama dari LocalStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) setUserName(parsed.name);
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Waktu & Sapaan Presisi Device
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

    // 3. Fetch Data API
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-3">
        <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
        <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500">Memuat data dasbor...</span>
      </div>
    );
  }

  const totalNetWorth = data?.totalNetWorth || 0;
  const monthlySummary = data?.monthlySummary || { income: 0, expense: 0 };
  const recentTransactions = data?.recentTransactions || [];

  // Ambil kata pertama dari nama (contoh: "Septian")
  const firstName = userName ? userName.trim().split(' ')[0] : '';

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. GREETING & DATE HEADER */}
      <div className="flex items-center justify-between px-0.5">
        <div>
          <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            {greeting}{firstName ? `, ${firstName}` : ''} 👋
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold">
            Ringkasan keuangan kamu hari ini
          </p>
        </div>
        {formattedToday && (
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-extrabold border border-slate-200/60 dark:border-slate-700/60">
            {formattedToday}
          </span>
        )}
      </div>

      {/* 2. DANGER ZONE / BUDGET WARNING BANNER */}
      <BudgetWarningBanner budgets={budgets} />

      {/* 3. SUMMARY CARDS */}
      <SummaryCards
        totalNetWorth={totalNetWorth}
        monthlySummary={monthlySummary}
        period={data?.period}
      />

      {/* 4. QUICK ACCESS FITUR */}
      <QuickAccess user={data?.user} />

      {/* 5. TRANSAKSI TERAKHIR */}
      <RecentTx
        transactions={recentTransactions}
        onRefresh={fetchDashboardData}
      />

      {/* 6. CHART KATEGORI */}
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