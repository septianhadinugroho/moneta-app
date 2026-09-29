'use client';

import { Palette } from 'lucide-react';

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
  selectedColor: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-700 block">Warna Tema</label>

      <div className="flex items-center gap-2 overflow-x-auto py-1.5 px-0.5 no-scrollbar scroll-smooth">
        {PRESET_COLORS.map((color) => {
          const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`w-7 h-7 rounded-full shrink-0 transition-transform ${
                isSelected ? 'scale-125 ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-110 opacity-90'
              }`}
              style={{ backgroundColor: color }}
            />
          );
        })}

        <label
          className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center cursor-pointer transition-transform relative overflow-hidden bg-linear-to-tr from-indigo-500 via-rose-500 to-amber-400 ${
            !PRESET_COLORS.includes(selectedColor.toLowerCase())
              ? 'scale-125 ring-2 ring-slate-900 ring-offset-2'
              : 'hover:scale-110 opacity-90'
          }`}
          title="Pilih Warna Custom"
        >
          <Palette className="w-3.5 h-3.5 text-white drop-shadow-xs" />
          <input
            type="color"
            value={selectedColor || '#0f172a'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>
    </div>
  );
}