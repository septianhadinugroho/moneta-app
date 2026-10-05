'use client';

import { Edit2, Trash2, Landmark, CreditCard, Nfc, Banknote, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface VirtualWalletCardProps {
  wallet: any;
  showBalance: boolean;
  onEdit: (wallet: any) => void;
  onDelete: (wallet: any) => void;
}

const getWalletIcon = (type: string) => {
  switch (String(type || '').toUpperCase()) {
    case 'BANK': return <Landmark className="w-4 h-4" />;
    case 'E_WALLET': return <CreditCard className="w-4 h-4" />;
    case 'E_MONEY': return <Nfc className="w-4 h-4" />;
    default: return <Banknote className="w-4 h-4" />;
  }
};

export default function VirtualWalletCard({
  wallet,
  showBalance,
  onEdit,
  onDelete,
}: VirtualWalletCardProps) {
  const baseColor = wallet.color || '#0284c7';
  const type = String(wallet.type || 'CASH').toUpperCase();

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${baseColor} 0%, ${baseColor}dd 60%, #090d16 100%)`,
        borderColor: `${baseColor}aa`,
      }}
      className="relative w-70 sm:w-[320px] shrink-0 p-4.5 rounded-3xl text-white shadow-xl border overflow-hidden font-sans snap-center flex flex-col justify-between transition-all duration-200 select-none cursor-grab active:cursor-grabbing"
    >
      {/* GLOW DEKORATIF DIBELAKANG KARTU */}
      <div 
        className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-30" 
        style={{ backgroundColor: baseColor }}
      />

      {/* HEADER KARTU */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-2xs">
            {getWalletIcon(type)}
          </div>
          <div className="truncate max-w-32.5 sm:max-w-40">
            <span className="text-[9px] font-black tracking-widest uppercase opacity-80 block">
              {type}
            </span>
            <h4 className="text-sm font-black tracking-tight truncate">{wallet.name}</h4>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md p-1 rounded-xl border border-white/10 shrink-0">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(wallet); }}
            className="p-1.5 hover:bg-white/20 rounded-lg transition text-white cursor-pointer active:scale-95"
            title="Edit Dompet"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(wallet); }}
            className="p-1.5 hover:bg-rose-500/40 rounded-lg transition text-white cursor-pointer active:scale-95"
            title="Hapus Dompet"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CHIP EMV */}
      <div className="my-3 flex items-center justify-between relative z-10">
        <div className="w-8 h-6 bg-amber-300/90 rounded-md border border-amber-400 flex flex-col justify-between p-0.5 shadow-inner">
          <div className="w-full h-0.5 bg-amber-700/40" />
          <div className="w-full h-0.5 bg-amber-700/40" />
        </div>
        <Nfc className="w-4 h-4 text-white/50" />
      </div>

      {/* FOOTER SALDO */}
      <div className="space-y-0.5 relative z-10">
        <p className="text-[9px] font-mono tracking-widest text-white/70">
          •••• •••• •••• {String(wallet.id).padStart(4, '0')}
        </p>

        <div className="flex justify-between items-end pt-0.5">
          <div>
            <span className="text-[8px] font-bold text-white/80 uppercase block">Saldo Aktif</span>
            <p className="text-base sm:text-lg font-black font-mono tracking-tight">
              {showBalance ? formatRupiah(wallet.balance) : '••••••••'}
            </p>
          </div>

          <div className="flex items-center gap-1 text-[8px] font-extrabold bg-white/20 px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-xs">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            <span>Terhubung</span>
          </div>
        </div>
      </div>
    </div>
  );
}