'use client';

import { ChevronDown, Check } from 'lucide-react';

interface DropdownOption {
  id: string | number;
  name: string;
  icon?: React.ElementType;
  iconBg?: string;
  color?: string;
}

interface CustomDropdownProps {
  label: string;
  required?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  selectedOption?: DropdownOption;
  options: DropdownOption[];
  onSelect: (id: string) => void;
  placeholder: string;
  error?: string;
  defaultIcon?: React.ElementType;
}

export default function CustomDropdown({
  label,
  required,
  isOpen,
  onToggle,
  selectedOption,
  options,
  onSelect,
  placeholder,
  error,
  defaultIcon: DefaultIcon,
}: CustomDropdownProps) {
  return (
    <div className="relative">
      <label className="block text-slate-700 font-bold mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {/* BUTTON TRIGGER */}
      <button
        type="button"
        onClick={onToggle}
        className={`w-full px-3.5 py-2.5 rounded-xl font-bold text-left flex justify-between items-center transition ${
          error
            ? 'bg-rose-50/60 border border-rose-500 ring-1 ring-rose-500'
            : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-slate-900'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <span className={`p-1 rounded-lg ${selectedOption.iconBg} shrink-0`}>
                  <selectedOption.icon className="w-3.5 h-3.5" />
                </span>
              )}
              {selectedOption.color && (
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: selectedOption.color }}
                />
              )}
              <span className="text-slate-900 font-extrabold">{selectedOption.name}</span>
            </>
          ) : (
            <>
              {DefaultIcon && <DefaultIcon className="w-4 h-4 text-slate-400 shrink-0" />}
              <span className="text-slate-400 font-medium">{placeholder}</span>
            </>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* DROPDOWN MENU FLOATING */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 max-h-44 overflow-y-auto p-1.5 animate-in fade-in zoom-in-95 duration-100 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          {options.length === 0 ? (
            <div className="p-3 text-center text-slate-400 font-medium text-xs">
              Pilihan tidak tersedia
            </div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelect(String(opt.id))}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-700/80 text-slate-200 flex justify-between items-center transition"
              >
                <span className="flex items-center gap-2.5 truncate">
                  {opt.icon && (
                    <span className={`p-1 rounded-lg ${opt.iconBg} shrink-0`}>
                      <opt.icon className="w-3.5 h-3.5" />
                    </span>
                  )}
                  {opt.color && (
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: opt.color }}
                    />
                  )}
                  <span className="font-extrabold text-xs text-white">{opt.name}</span>
                </span>
                {String(selectedOption?.id) === String(opt.id) && (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                )}
              </button>
            ))
          )}
        </div>
      )}

      {error && (
        <p className="text-[11px] text-rose-600 font-extrabold mt-1 animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
}