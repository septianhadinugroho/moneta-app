'use client';

import { useState, useMemo, useCallback } from 'react';
import { formatRupiah } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon, Eye, EyeOff, Calendar } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import CustomDropdown from '@/components/ui/CustomDropdown';
import { useTheme } from 'next-themes';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const generateUniqueColors = (count: number, isIncome: boolean) => {
  if (count === 0) return [];
  return Array.from({ length: count }, (_, i) => {
    const hue = (i * (360 / count) + (isIncome ? 130 : 10)) % 360;
    return `hsl(${hue}, 80%, 45%)`;
  });
};

export default function ExpenseChart({
  expenseCategories = [],
  incomeCategories = [],
  period,
  availableYears = [],
  onPeriodChange,
}: {
  expenseCategories?: any[];
  incomeCategories?: any[];
  period?: { month: number; year: number };
  availableYears?: number[];
  onPeriodChange?: (month: number, year: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [showAmount, setShowAmount] = useState(true);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const now = new Date();
  const currentMonth = period?.month || now.getMonth() + 1;
  const currentYear = period?.year || now.getFullYear();

  // OPTIONS DROPDOWN DINAMIS
  const monthOptions = MONTH_NAMES.map((m, idx) => ({ id: String(idx + 1), name: m }));
  
  const yearList = availableYears.length > 0 ? availableYears : [2026, currentYear];
  const yearOptions = Array.from(new Set(yearList))
    .sort((a, b) => a - b)
    .map((y) => ({ id: String(y), name: String(y) }));

  // MEMOIZED CUSTOM LABEL BIAR CHART GAK KEDIP SAAT MATA DI-TOGGLE
  const renderCustomizedLabel = useCallback((props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, payload, percent } = props;
    if (percent < 0.04) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const iconName = payload.icon || payload.categoryIcon || payload.category?.icon || 'Tag';

    return (
      <foreignObject
        x={x - 10}
        y={y - 10}
        width={20}
        height={20}
        className="overflow-visible pointer-events-none"
      >
        <div className="w-5 h-5 flex items-center justify-center text-white drop-shadow-xs">
          <CategoryIcon name={iconName} className="w-3.5 h-3.5" />
        </div>
      </foreignObject>
    );
  }, []);

  const rawData = activeTab === 'EXPENSE' ? expenseCategories : incomeCategories;
  const isIncome = activeTab === 'INCOME';
  const dynamicColors = generateUniqueColors(rawData?.length || 0, isIncome);

  const currentData = useMemo(() => {
    return (rawData || []).map((item, idx) => ({
      ...item,
      categoryId: item.categoryId || item.id || `cat-${idx}`,
      categoryName: item.categoryName || item.name || item.category?.name || 'Lainnya',
      totalAmount: Number(item.totalAmount || item.total || item.amount || 0),
      color: item.color || item.categoryColor || item.category?.color || dynamicColors[idx],
      icon: item.icon || item.categoryIcon || item.category?.icon || 'Tag',
    }));
  }, [rawData, dynamicColors]);

  const hasMultipleCategories = currentData.length > 3;

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. HEADER UTAMA + TOGGLE MATA */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
            Breakdown Kategori
          </h2>
          <button
            type="button"
            onClick={() => setShowAmount(!showAmount)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 rounded-lg cursor-pointer"
            title={showAmount ? 'Sembunyikan Nominal' : 'Tampilkan Nominal'}
          >
            {showAmount ? (
              <Eye className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>

        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
          {MONTH_NAMES[currentMonth - 1]} {currentYear}
        </span>
      </div>

      {/* 2. DROPDOWN PERIODE DINAMIS (GAYA SAMA SEPERTI DI ANALISTIK) */}
      <div className="grid grid-cols-2 gap-2">
        <CustomDropdown
          label="Bulan"
          isOpen={isMonthOpen}
          onToggle={() => {
            setIsMonthOpen(!isMonthOpen);
            setIsYearOpen(false);
          }}
          selectedOption={monthOptions.find((m) => m.id === String(currentMonth))}
          options={monthOptions}
          onSelect={(id) => {
            setIsMonthOpen(false);
            if (onPeriodChange) onPeriodChange(Number(id), currentYear);
          }}
          placeholder="Pilih Bulan"
          defaultIcon={Calendar}
        />
        <CustomDropdown
          label="Tahun"
          isOpen={isYearOpen}
          onToggle={() => {
            setIsYearOpen(!isYearOpen);
            setIsMonthOpen(false);
          }}
          selectedOption={
            yearOptions.find((y) => y.id === String(currentYear)) || {
              id: String(currentYear),
              name: String(currentYear),
            }
          }
          options={yearOptions}
          onSelect={(id) => {
            setIsYearOpen(false);
            if (onPeriodChange) onPeriodChange(currentMonth, Number(id));
          }}
          placeholder="Pilih Tahun"
          defaultIcon={Calendar}
        />
      </div>

      {/* 3. SEGMENTED TAB SWITCHER */}
      <div className="bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl grid grid-cols-2 gap-1 text-xs font-black">
        <button
          type="button"
          onClick={() => setActiveTab('EXPENSE')}
          className={`py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'EXPENSE'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
          Pengeluaran
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('INCOME')}
          className={`py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'INCOME'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
          Pemasukan
        </button>
      </div>

      {/* 4. CHART & LIST KATEGORI */}
      {currentData.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-10 font-medium">
          Belum ada data {activeTab === 'EXPENSE' ? 'pengeluaran' : 'pemasukan'} pada {MONTH_NAMES[currentMonth - 1]} {currentYear}.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="h-48 sm:h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  isAnimationActive={false} // Mencegah flicker
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {currentData.map((item, index) => (
                    <Cell
                      key={`cell-${item.categoryId}-${index}`}
                      fill={item.color}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => showAmount ? formatRupiah(val) : '••••••••'}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* LIST KATEGORI DENGAN INDIKATOR SCROLLBAR */}
          <div className="relative">
            <div className="max-h-36 overflow-y-auto pr-1 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/60">
              {currentData.map((item) => (
                <div
                  key={item.categoryId}
                  className="pt-1.5 flex justify-between items-center text-xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    >
                      <CategoryIcon name={item.icon} className="w-3 h-3" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-36">
                      {item.categoryName}
                    </span>
                  </div>
                  <span className="font-black text-slate-900 dark:text-slate-100 shrink-0">
                    {showAmount ? formatRupiah(item.totalAmount) : '••••••••'}
                  </span>
                </div>
              ))}
            </div>

            {hasMultipleCategories && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-slate-900 to-transparent opacity-80" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}