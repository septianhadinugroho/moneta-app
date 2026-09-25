'use client';

import { formatRupiah } from '@/lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function ExpenseChart({ categories }: { categories: any[] }) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
        <svg className="w-4 h-4 text-[#16A085]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        Kategori Pengeluaran
      </h2>

      {!categories || categories.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-12">Belum ada data pengeluaran.</p>
      ) : (
        <div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#16A085'} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => formatRupiah(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2 divide-y divide-slate-100">
            {categories.map((item) => (
              <div key={item.categoryId} className="pt-2 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || '#16A085' }}
                  ></span>
                  <span className="text-slate-600 font-semibold">{item.categoryName}</span>
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