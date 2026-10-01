'use client';

import { Calendar as CalendarIcon, X } from 'lucide-react';

interface CustomDatePickerProps {
  label?: string;
  value: string; // Format "YYYY-MM-DD"
  onChange: (dateStr: string) => void;
  placeholder?: string;
}

export default function CustomDatePicker({
  label,
  value,
  onChange,
  placeholder = 'Pilih Tanggal',
}: CustomDatePickerProps) {
  // Format tampilan tanggal ke Indonesia (misal: "02 Jan 2027")
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
        <label className="block text-slate-700 font-extrabold text-xs">
          {label}
        </label>
      )}

      {/* CONTAINER INPUT STYLED */}
      <div className="relative flex items-center">
        <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 flex items-center justify-between hover:bg-slate-100/80 transition relative pointer-events-none">
          <span className="flex items-center gap-2 truncate">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className={formattedDisplay ? 'text-slate-900 font-extrabold' : 'text-slate-400 font-medium'}>
              {formattedDisplay || placeholder}
            </span>
          </span>
        </div>

        {/* NATIVE DATE INPUT OVERLAY (Buka Datepicker Native OS/Mobile yang Fleksibel & Cepat) */}
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
        />

        {/* TOMBOL CLEAR TANGGAL */}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="absolute right-2.5 z-20 text-slate-400 hover:text-slate-600 p-0.5 rounded-full bg-slate-200/50 transition cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}