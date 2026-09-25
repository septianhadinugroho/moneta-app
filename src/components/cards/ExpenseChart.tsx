'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

export default function ExpenseChart({ categories }: { categories: any[] }) {
  const [filterRange, setFilterRange] = useState<'week' | 'month'>('month');

  // Skema Warna Donut Chart yang Muted & Modern
  const COLORS = ['#059669', '#2563EB', '#D97706', '#E11D48', '#8B5CF6', '#0891B2'];

  const hasData = categories && categories.length > 0;

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-700" />
          Kategori Pengeluaran
        </h2>

        {/* RANGE TOGGLE */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            onClick={() => setFilterRange('week')}
            className={`px-2 py-1 rounded-md transition ${
              filterRange === 'week' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Minggu Ini
          </button>
          <button
            onClick={() => setFilterRange('month')}
            className={`px-2 py-1 rounded-md transition ${
              filterRange === 'month' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
            }`}
          >
            Bulan Ini
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="py-8 text-center space-y-1">
          <p className="text-xs font-semibold text-slate-400">Belum ada pengeluaran periode ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => formatRupiah(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 divide-y divide-slate-100">
            {categories.map((item, idx) => (
              <div key={item.categoryId || idx} className="pt-1.5 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || COLORS[idx % COLORS.length] }}
                  ></span>
                  <span className="text-slate-600 font-medium truncate max-w-30 sm:max-w-40">
                    {item.categoryName}
                  </span>
                </div>
                <span className="font-extrabold text-slate-900">{formatRupiah(item.totalAmount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}