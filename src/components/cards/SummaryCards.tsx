'use client';
import { formatRupiah } from '@/lib/utils';

export default function SummaryCards({ summary }: { summary: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* NET WORTH - CARD GELAP DENGAN KONTRAS TINGGI */}
      <div className="bg-[#0F3D34] text-white p-5 rounded-2xl shadow-sm border border-[#0F3D34]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-emerald-200">Total Net Worth</p>
            <h2 className="text-2xl font-black mt-1 text-white tracking-tight">
              {formatRupiah(summary?.totalNetWorth || 0)}
            </h2>
          </div>
          <div className="p-2 bg-[#16A085]/30 rounded-xl text-emerald-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="text-[11px] text-emerald-100/70 mt-3">Total akumulasi seluruh akun</p>
      </div>

      {/* INCOME */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-500">Pemasukan Bulan Ini</p>
            <h2 className="text-2xl font-extrabold text-[#16A085] mt-1 tracking-tight">
              {formatRupiah(summary?.monthlySummary?.income || 0)}
            </h2>
          </div>
          <div className="p-2 bg-emerald-50 text-[#16A085] rounded-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <span className="inline-block mt-3 text-[11px] font-semibold text-[#16A085]">
          ↑ Pemasukan Aktif
        </span>
      </div>

      {/* EXPENSE */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold text-slate-500">Pengeluaran Bulan Ini</p>
            <h2 className="text-2xl font-extrabold text-rose-600 mt-1 tracking-tight">
              {formatRupiah(summary?.monthlySummary?.expense || 0)}
            </h2>
          </div>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
        <span className="inline-block mt-3 text-[11px] font-semibold text-rose-600">
          ↓ Pengeluaran Aktif
        </span>
      </div>
    </div>
  );
}