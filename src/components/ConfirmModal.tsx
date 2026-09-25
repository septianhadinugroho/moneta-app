'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
  typeToConfirm?: string; // Jika diisi (misal "DELETE"), user wajib mengetikkan string ini sebelum tombol confirm aktif
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'danger',
  loading = false,
  typeToConfirm,
}: ConfirmModalProps) {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const isTypeMatched = typeToConfirm ? inputText === typeToConfirm : true;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-rose-100 text-rose-600',
          buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-100 text-amber-600',
          buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      default:
        return {
          iconBg: 'bg-emerald-100 text-emerald-700',
          buttonBg: 'bg-slate-900 hover:bg-slate-800 text-white',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-100 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3.5">
          <div className={`p-2.5 rounded-xl shrink-0 ${styles.iconBg}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        {typeToConfirm && (
          <div className="pt-1">
            <p className="text-[11px] font-semibold text-slate-600 mb-1.5">
              Ketik <span className="font-extrabold text-slate-900">{typeToConfirm}</span> untuk mengonfirmasi:
            </p>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={typeToConfirm}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 transition"
            />
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={!isTypeMatched || loading}
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed ${styles.buttonBg}`}
          >
            {loading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}