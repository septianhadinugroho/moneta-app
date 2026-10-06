'use client';

import { useState } from 'react';
import { Palette, Check, SlidersHorizontal, X } from 'lucide-react';

const PRESET_COLORS = [
  '#0f172a', // Slate / Dark
  '#2563eb', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber / Orange
  '#ef4444', // Red
  '#8b5cf6', // Violet / Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#6366f1', // Indigo
  '#d97706', // Gold
  '#14b8a6', // Teal
];

interface ColorPickerProps {
  label?: string;
  selectedColor: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ label = 'Warna Tema', selectedColor, onChange }: ColorPickerProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const normalizedSelected = (selectedColor || '#0f172a').toLowerCase();
  const isCustomColor = !PRESET_COLORS.some((c) => c.toLowerCase() === normalizedSelected);

  return (
    <div className="space-y-1.5 font-sans relative">
      <div className="flex justify-between items-center">
        <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300">{label}</label>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
          {selectedColor}
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 no-scrollbar scroll-smooth">
        {PRESET_COLORS.map((color) => {
          const isSelected = normalizedSelected === color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => {
                onChange(color);
                setIsCustomOpen(false);
              }}
              className={`w-7 h-7 rounded-full shrink-0 transition-all flex items-center justify-center cursor-pointer relative ${
                isSelected
                  ? 'scale-110 ring-2 ring-slate-900 dark:ring-slate-100 ring-offset-2 dark:ring-offset-slate-900 shadow-xs'
                  : 'hover:scale-105 opacity-90'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs stroke-3" />}
            </button>
          );
        })}

        {/* CUSTOM COLOR BUTTON TRIGGER */}
        <button
          type="button"
          onClick={() => setIsCustomOpen(!isCustomOpen)}
          className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center cursor-pointer transition-all relative overflow-hidden ${
            isCustomColor
              ? 'scale-110 ring-2 ring-slate-900 dark:ring-slate-100 ring-offset-2 dark:ring-offset-slate-900 shadow-xs'
              : 'hover:scale-105 opacity-90 bg-linear-to-tr from-indigo-500 via-rose-500 to-amber-400'
          }`}
          style={isCustomColor ? { backgroundColor: selectedColor } : undefined}
          title="Pilih Warna Kustom"
        >
          {isCustomColor ? (
            <Check className="w-3.5 h-3.5 text-white drop-shadow-xs stroke-3" />
          ) : (
            <Palette className="w-3.5 h-3.5 text-white drop-shadow-xs" />
          )}
        </button>
      </div>

      {/* FLOATING CUSTOM COLOR PICKER POPOVER */}
      {isCustomOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-60 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 p-3 space-y-3 animate-in fade-in zoom-in-95 duration-150 text-slate-900 dark:text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Warna Kustom</span>
            </div>
            <button
              type="button"
              onClick={() => setIsCustomOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* COLOR PREVIEW & INPUTS */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl shrink-0 border border-slate-200/80 dark:border-slate-700 shadow-xs relative overflow-hidden flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: selectedColor || '#0f172a' }}
            >
              <input
                type="color"
                value={selectedColor || '#0f172a'}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full scale-150"
              />
            </div>

            <div className="flex-1 space-y-0.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Kode Hex</label>
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => onChange(e.target.value)}
                placeholder="#0f172a"
                maxLength={7}
                className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-extrabold text-slate-900 dark:text-white focus:outline-hidden focus:border-slate-400 dark:focus:border-slate-500 uppercase"
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
            Klik lingkaran warna di atas untuk memilih dari spektrum warna.
          </p>
        </div>
      )}
    </div>
  );
}