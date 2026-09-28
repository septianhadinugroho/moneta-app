'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

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
}: {
  expenseCategories?: any[];
  incomeCategories?: any[];
}) {
  const [activeTab, setActiveTab] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  const currentData = activeTab === 'EXPENSE' ? expenseCategories : incomeCategories;
  const isIncome = activeTab === 'INCOME';

  const dynamicColors = generateUniqueColors(currentData?.length || 0, isIncome);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-700" />
          Breakdown Kategori
        </h2>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[10px] font-extrabold">
          <button
            onClick={() => setActiveTab('EXPENSE')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeTab === 'EXPENSE'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => setActiveTab('INCOME')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeTab === 'INCOME'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Pemasukan
          </button>
        </div>
      </div>

      {(!currentData || currentData.length === 0) ? (
        <p className="text-xs text-slate-400 text-center py-10 font-medium">
          Belum ada data {activeTab === 'EXPENSE' ? 'pengeluaran' : 'pemasukan'} bulan ini.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                >
                  {currentData.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={item.color || dynamicColors[index]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => formatRupiah(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
            {currentData.map((item, idx) => (
              <div
                key={item.categoryId || idx}
                className="pt-1.5 flex justify-between items-center text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: item.color || dynamicColors[idx],
                    }}
                  ></span>
                  <span className="text-slate-600 font-bold truncate max-w-32">
                    {item.categoryName}
                  </span>
                </div>
                <span className="font-black text-slate-900">
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