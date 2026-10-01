'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
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

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function StatsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [txData, setTxData] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get('/transactions', { params: { limit: 1000, year: selectedYear } })
      .then((res) => {
        setTxData(res.data.data || []);
      })
      .catch((err) => console.error('Gagal memuat data statistik:', err))
      .finally(() => setLoading(false));
  }, [selectedYear]);

  // Options Dropdown
  const monthOptions = MONTH_NAMES.map((m, idx) => ({ id: String(idx + 1), name: m }));
  const yearOptions = [2025, 2026, 2027].map((y) => ({ id: String(y), name: String(y) }));

  // 1. DATA PIE CHART: Pengeluaran Per Kategori pada Bulan Dipilih
  const categoryChartData = useMemo(() => {
    const filtered = txData.filter((tx) => {
      const d = new Date(tx.date || tx.createdAt);
      return (
        d.getMonth() + 1 === selectedMonth &&
        d.getFullYear() === selectedYear &&
        String(tx.type).toUpperCase() === 'EXPENSE'
      );
    });

    const categoryMap: { [key: string]: { name: string; value: number; color: string } } = {};

    filtered.forEach((tx) => {
      const catName = tx.category?.name || 'Lainnya';
      const catColor = tx.category?.color || '#0f172a';
      const amt = Number(tx.amount || 0);

      if (!categoryMap[catName]) {
        categoryMap[catName] = { name: catName, value: 0, color: catColor };
      }
      categoryMap[catName].value += amt;
    });

    return Object.values(categoryMap).sort((a, b) => b.value - a.value);
  }, [txData, selectedMonth, selectedYear]);

  const totalMonthlyExpense = useMemo(() => {
    return categoryChartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [categoryChartData]);

  // 2. DATA BAR CHART: Arus Kas Pemasukan vs Pengeluaran 12 Bulan (Tahun Dipilih)
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
    <div className="p-4 sm:p-5 space-y-4 font-sans text-slate-900 pb-28">
      {/* HEADER PAGE */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900">Analistik & Visualisasi</h1>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Laporan Grafik & Proporsi Keuangan</p>
        </div>
      </div>

      {/* FILTER PERIODE BULAN & TAHUN */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs grid grid-cols-2 gap-2">
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
          selectedOption={yearOptions.find((y) => y.id === String(selectedYear))}
          options={yearOptions}
          onSelect={(id) => { setSelectedYear(Number(id)); setIsYearOpen(false); }}
          placeholder="Pilih Tahun"
          defaultIcon={Calendar}
        />
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
          <span className="text-xs font-bold">Menganalisis data...</span>
        </div>
      ) : (
        <>
          {/* 1. PIE CHART SECTION */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-black text-slate-900">Porsi Pengeluaran Kategori</h2>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
              </span>
            </div>

            {categoryChartData.length === 0 ? (
              <div className="py-10 text-center text-xs font-bold text-slate-400 space-y-1">
                <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                <p>Tidak ada pengeluaran pada bulan ini.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => formatRupiah(Number(value))}
                        contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* BREAKDOWN LEGEND LIST */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {categoryChartData.map((item) => {
                    const percentage = ((item.value / totalMonthlyExpense) * 100).toFixed(1);
                    return (
                      <div key={item.name} className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-slate-700 truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-slate-400 text-[10px] font-mono">{percentage}%</span>
                          <span className="text-slate-900 font-extrabold">{formatRupiah(item.value)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. BAR CHART SECTION (CASH FLOW) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-black text-slate-900">Perbandingan Arus Kas {selectedYear}</h2>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="monthName" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 'bold', fill: '#94a3b8' }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    formatter={(val: any) => formatRupiah(Number(val))}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
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