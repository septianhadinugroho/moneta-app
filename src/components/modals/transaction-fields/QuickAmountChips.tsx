'use client';

import { RotateCcw } from 'lucide-react';

interface QuickAmountChipsProps {
  onAddAmount: (val: number) => void;
  onReset: () => void;
}

const QUICK_AMOUNTS = [
  { label: '+10rb', value: 10000 },
  { label: '+20rb', value: 20000 },
  { label: '+50rb', value: 50000 },
  { label: '+100rb', value: 100000 },
];

export default function QuickAmountChips({ onAddAmount, onReset }: QuickAmountChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-1">
      {QUICK_AMOUNTS.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onAddAmount(item.value)}
          className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold transition cursor-pointer"
        >
          {item.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="p-1 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-lg text-[10px] font-bold transition cursor-pointer ml-auto"
        title="Reset Nominal"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
}