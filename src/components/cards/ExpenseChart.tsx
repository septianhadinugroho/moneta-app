'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { useTheme } from 'next-themes';

const generateUniqueColors = (count: number, isIncome: boolean) => {
  if (count === 0) return [];
  return Array.from({ length: count }, (_, i) => {
    const hue = (i * (360 / count) + (isIncome ? 130 : 10)) % 360;
    return `hsl(${hue}, 80%, 45%)`;
  });
};

// RENDER IKON DI DALAM SLICE DONUT (AMBIL DARI BERBAGAI KEMUNGKINAN PROPERTI)
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, payload, percent } = props;
  
  if (percent < 0.04) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // DETEKSI IKON DARI PAYLOAD SECARA FLEKSIBEL
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
};

export default function ExpenseChart({
  expenseCategories = [],
  incomeCategories = [],
}: {
  expenseCategories?: any[];
  incomeCategories?: any[];
}) {
  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const rawData = activeTab === 'EXPENSE' ? expenseCategories : incomeCategories;
  const isIncome = activeTab === 'INCOME';

  const dynamicColors = generateUniqueColors(rawData?.length || 0, isIncome);

  // SANITASI DATA: NORMALIZE PROPERTI AGAR SEMUA FIELD PASTI ADA
  const currentData = (rawData || []).map((item, idx) => ({
    ...item,
    categoryId: item.categoryId || item.id || `cat-${idx}`,
    categoryName: item.categoryName || item.name || item.category?.name || 'Lainnya',
    totalAmount: Number(item.totalAmount || item.total || item.amount || 0),
    color: item.color || item.categoryColor || item.category?.color || dynamicColors[idx],
    icon: item.icon || item.categoryIcon || item.category?.icon || 'Tag',
  }));

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex justify-between items-center">
        <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          Breakdown Kategori
        </h2>

        {/* SWITCHER TAB */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-extrabold">
          <button
            type="button"
            onClick={() => setActiveTab('EXPENSE')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              activeTab === 'EXPENSE'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('INCOME')}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              activeTab === 'INCOME'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Pemasukan
          </button>
        </div>
      </div>

      {currentData.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-10 font-medium">
          Belum ada data {activeTab === 'EXPENSE' ? 'pengeluaran' : 'pemasukan'} bulan ini.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="h-52 w-full">
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
                  formatter={(val: any) => formatRupiah(val)}
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

          {/* LIST LEGEND BREAKDOWN DENGAN IKON REAL */}
          <div className="space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/60 max-h-48 overflow-y-auto pr-1">
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
                  <span className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-32">
                    {item.categoryName}
                  </span>
                </div>
                <span className="font-black text-slate-900 dark:text-slate-100 shrink-0">
                  {formatRupiah(item.totalAmount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}