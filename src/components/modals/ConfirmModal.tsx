'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  description?: string; // Menampung prop 'description' atau 'message'
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
  typeToConfirm?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  variant = 'danger',
  loading = false,
  typeToConfirm,
}: ConfirmModalProps) {
  const [inputText, setInputText] = useState('');

  // Reset input teks saat modal dibuka/ditutup
  useEffect(() => {
    if (!isOpen) setInputText('');
  }, [isOpen]);

  if (!isOpen) return null;

  const isTypeMatched = typeToConfirm ? inputText === typeToConfirm : true;
  const contentText = description || message || '';

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-rose-100 text-rose-600',
          buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-100 text-amber-600',
          buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs',
        };
      default:
        return {
          iconBg: 'bg-emerald-100 text-emerald-700',
          buttonBg: 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xs w-full p-5 space-y-4 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ICON & HEADER */}
        <div className="text-center pt-1">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${styles.iconBg}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-slate-900">{title}</h3>
          {contentText && (
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{contentText}</p>
          )}
        </div>

        {/* INPUT SAFETY CHECK (IF REQUIRED) */}
        {typeToConfirm && (
          <div className="pt-1">
            <p className="text-[11px] font-semibold text-slate-600 mb-1.5 text-center">
              Ketik <span className="font-extrabold text-slate-900">{typeToConfirm}</span> untuk mengonfirmasi:
            </p>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={typeToConfirm}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-center transition"
            />
          </div>
        )}

        {/* BUTTON ACTIONS */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={!isTypeMatched || loading}
            onClick={onConfirm}
            className={`py-2.5 text-xs font-extrabold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed ${styles.buttonBg}`}
          >
            {loading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}