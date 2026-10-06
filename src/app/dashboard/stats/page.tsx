'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  Calendar, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import CustomDropdown from '@/components/ui/CustomDropdown';
import CategoryIcon from '@/components/ui/CategoryIcon';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// HELPER RENDER IKON PAS DI TENGAH BUSUR SLICE DONUT
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, payload, percent } = props;
  
  // Sembunyikan ikon jika potongan chart terlalu tipis (< 4%)
  if (percent < 0.04) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <foreignObject
      x={x - 10}
      y={y - 10}
      width={20}
      height={20}
      className="overflow-visible pointer-events-none"
    >
      <div className="w-5 h-5 flex items-center justify-center text-white drop-shadow-xs">
        <CategoryIcon name={payload.icon || 'Tag'} className="w-3.5 h-3.5" />
      </div>
    </foreignObject>
  );
};

export default function StatsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [txData, setTxData] = useState<any[]>([]);
  const [allUserTransactions, setAllUserTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllHistory = async () => {
      try {
        const res = await api.get('/transactions', { params: { limit: 1000 } });
        setAllUserTransactions(res.data.data || []);
      } catch (err) {
        console.error('Gagal mengambil histori tahun:', err);
      }
    };
    fetchAllHistory();
  }, []);

  useEffect(() => {
    const fetchYearlyStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/transactions', { params: { limit: 1000, year: selectedYear } });
        setTxData(res.data.data || []);
      } catch (err) {
        console.error('Gagal memuat data statistik:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchYearlyStats();
  }, [selectedYear]);

  // 3. Ekstrak Tahun Unik
  const dynamicYears = useMemo(() => {
    const yearsSet = new Set<number>();
    yearsSet.add(2026);
    yearsSet.add(currentYear);

    allUserTransactions.forEach((tx) => {
      if (tx.date || tx.createdAt) {
        const y = new Date(tx.date || tx.createdAt).getFullYear();
        if (!isNaN(y)) yearsSet.add(y);
      }
    });

    return Array.from(yearsSet).sort((a, b) => a - b);
  }, [allUserTransactions, currentYear]);

  // Options Dropdown
  const monthOptions = MONTH_NAMES.map((m, idx) => ({ id: String(idx + 1), name: m }));
  const yearOptions = useMemo(() => {
    return dynamicYears.map((y) => ({ id: String(y), name: String(y) }));
  }, [dynamicYears]);

  // 4. DATA PIE CHART: Pengeluaran Per Kategori (TERMASUK ICON)
  const categoryChartData = useMemo(() => {
    const filtered = txData.filter((tx) => {
      const d = new Date(tx.date || tx.createdAt);
      return (
        d.getMonth() + 1 === selectedMonth &&
        d.getFullYear() === selectedYear &&
        String(tx.type).toUpperCase() === 'EXPENSE'
      );
    });

    const categoryMap: { [key: string]: { name: string; value: number; color: string; icon: string } } = {};

    filtered.forEach((tx) => {
      const catName = tx.category?.name || 'Lainnya';
      const catColor = tx.category?.color || '#0f172a';
      const catIcon = tx.category?.icon || 'Tag';
      const amt = Number(tx.amount || 0);

      if (!categoryMap[catName]) {
        categoryMap[catName] = { name: catName, value: 0, color: catColor, icon: catIcon };
      }
      categoryMap[catName].value += amt;
    });

    return Object.values(categoryMap).sort((a, b) => b.value - a.value);
  }, [txData, selectedMonth, selectedYear]);

  const totalMonthlyExpense = useMemo(() => {
    return categoryChartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [categoryChartData]);

  // 5. DATA BAR CHART
  const cashFlowChartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      monthName: MONTH_NAMES[i].slice(0, 3),
      Pemasukan: 0,
      Pengeluaran: 0,
    }));

    txData.forEach((tx) => {
      const d = new Date(tx.date || tx.createdAt);
      if (d.getFullYear() === selectedYear) {
        const monthIdx = d.getMonth();
        const amt = Number(tx.amount || 0);
        const type = String(tx.type).toUpperCase();

        if (type === 'INCOME') months[monthIdx].Pemasukan += amt;
        if (type === 'EXPENSE') months[monthIdx].Pengeluaran += amt;
      }
    });

    return months;
  }, [txData, selectedYear]);

  return (
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* HEADER PAGE */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">Analistik & Visualisasi</h1>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Laporan Grafik & Proporsi Keuangan</p>
        </div>
      </div>

      {/* FILTER PERIODE BULAN & TAHUN */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs grid grid-cols-2 gap-2">
        <CustomDropdown
          label="Bulan Analisis"
          isOpen={isMonthOpen}
          onToggle={() => { setIsMonthOpen(!isMonthOpen); setIsYearOpen(false); }}
          selectedOption={monthOptions.find((m) => m.id === String(selectedMonth))}
          options={monthOptions}
          onSelect={(id) => { setSelectedMonth(Number(id)); setIsMonthOpen(false); }}
          placeholder="Pilih Bulan"
          defaultIcon={Calendar}
        />
        <CustomDropdown
          label="Tahun"
          isOpen={isYearOpen}
          onToggle={() => { setIsYearOpen(!isYearOpen); setIsMonthOpen(false); }}
          selectedOption={yearOptions.find((y) => y.id === String(selectedYear)) || { id: String(selectedYear), name: String(selectedYear) }}
          options={yearOptions}
          onSelect={(id) => { setSelectedYear(Number(id)); setIsYearOpen(false); }}
          placeholder="Pilih Tahun"
          defaultIcon={Calendar}
        />
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold">Menganalisis data...</span>
        </div>
      ) : (
        <>
          {/* 1. PIE CHART SECTION */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-xs font-black text-slate-900 dark:text-white">Porsi Pengeluaran Kategori</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
              </span>
            </div>

            {categoryChartData.length === 0 ? (
              <div className="py-10 text-center text-xs font-bold text-slate-400 dark:text-slate-500 space-y-1">
                <AlertCircle className="w-6 h-6 text-amber-500 dark:text-amber-400 mx-auto" />
                <p>Tidak ada pengeluaran pada bulan ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* DONUT CHART WITH IN-SLICE ICON LABELS */}
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => formatRupiah(Number(value))}
                        contentStyle={{ 
                          backgroundColor: 'var(--tooltip-bg, #0f172a)', 
                          borderColor: 'var(--tooltip-border, #1e293b)', 
                          color: '#fff', 
                          borderRadius: '12px', 
                          fontSize: '11px', 
                          fontWeight: 'bold' 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* BREAKDOWN LEGEND LIST DENGAN IKON */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {categoryChartData.map((item) => {
                    const percentage = totalMonthlyExpense > 0 
                      ? ((item.value / totalMonthlyExpense) * 100).toFixed(1) 
                      : '0.0';
                    return (
                      <div key={item.name} className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                            style={{ backgroundColor: item.color }}
                          >
                            <CategoryIcon name={item.icon} className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono">{percentage}%</span>
                          <span className="text-slate-900 dark:text-white font-extrabold">{formatRupiah(item.value)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. BAR CHART SECTION */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-xs font-black text-slate-900 dark:text-white">Perbandingan Arus Kas {selectedYear}</h2>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--grid-color, #f1f5f9)" className="[--grid-color:#f1f5f9] dark:[--grid-color:#1e293b]" />
                  <XAxis dataKey="monthName" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => formatRupiah(Number(val))}
                    contentStyle={{ 
                      backgroundColor: 'var(--tooltip-bg, #0f172a)', 
                      borderColor: 'var(--tooltip-border, #1e293b)', 
                      color: '#fff', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: 'bold' 
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 'bold' }} />
                  <Bar dataKey="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}