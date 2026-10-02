'use client';

import { Calendar as CalendarIcon, X } from 'lucide-react';

interface CustomDatePickerProps {
  label?: string;
  value: string;
  onChange: (dateStr: string) => void;
  placeholder?: string;
}

export default function CustomDatePicker({
  label,
  value,
  onChange,
  placeholder = 'Pilih Tanggal',
}: CustomDatePickerProps) {
  const formattedDisplay = value
    ? new Date(value).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div className="space-y-1 font-sans w-full">
      {label && (
        <label className="block text-slate-700 dark:text-slate-300 font-extrabold text-xs">
          {label}
        </label>
      )}

      {/* CONTAINER INPUT STYLED */}
      <div className="relative flex items-center">
        <div className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition relative pointer-events-none">
          <span className="flex items-center gap-2 truncate">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className={formattedDisplay ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-400 dark:text-slate-500 font-medium'}>
              {formattedDisplay || placeholder}
            </span>
          </span>
        </div>

        {/* NATIVE DATE INPUT OVERLAY */}
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 [color-scheme:light] dark:[color-scheme:dark]"
        />

        {/* TOMBOL CLEAR TANGGAL */}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="absolute right-2.5 z-20 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 p-0.5 rounded-full bg-slate-200/50 dark:bg-slate-700/50 transition cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}