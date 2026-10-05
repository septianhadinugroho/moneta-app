'use client';

import { Calendar } from 'lucide-react';

interface QuickDatePickerProps {
  date: string;
  dateType: 'today' | 'yesterday' | 'custom';
  onQuickSelect: (mode: 'today' | 'yesterday' | 'custom') => void;
  onCustomDateChange: (val: string) => void;
  error?: string;
}

export default function QuickDatePicker({
  date,
  dateType,
  onQuickSelect,
  onCustomDateChange,
  error,
}: QuickDatePickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-slate-700 dark:text-slate-300 font-bold flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        <span>Tanggal Transaksi <span className="text-rose-500">*</span></span>
      </label>

      <div className="grid grid-cols-3 gap-1.5">
        {(['today', 'yesterday', 'custom'] as const).map((mode) => {
          const labels = { today: 'Hari Ini', yesterday: 'Kemarin', custom: 'Kustom' };
          const isSelected = dateType === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => onQuickSelect(mode)}
              className={`py-1.5 rounded-xl text-[10px] font-extrabold transition cursor-pointer border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {labels[mode]}
            </button>
          );
        })}
      </div>

      {dateType === 'custom' && (
        <input
          type="date"
          value={date}
          onChange={(e) => onCustomDateChange(e.target.value)}
          className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 transition scheme-light dark:scheme-dark mt-1 ${
            error
              ? 'bg-rose-50/60 dark:bg-rose-950/40 border border-rose-500 ring-1 ring-rose-500'
              : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80'
          }`}
        />
      )}
      {error && <p className="text-[11px] text-rose-600 dark:text-rose-400 font-extrabold">{error}</p>}
    </div>
  );
}