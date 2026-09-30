import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatRupiah } from '@/lib/utils';

interface ExportPdfParams {
  periodText: string;
  transactions: any[];
  totalIncome: number;
  totalExpense: number;
  userName?: string;
  userEmail?: string;
  returnBlob?: boolean;
}

// Helper untuk load image dari public folder ke Base64
const loadImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject('Canvas context failed');
      }
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
};

export const generateTransactionsPdf = async ({
  periodText,
  transactions,
  totalIncome,
  totalExpense,
  userName = 'Pengguna Moneta',
  userEmail = '',
  returnBlob = false,
}: ExportPdfParams) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const netBalance = totalIncome - totalExpense;

  // 1. BRANDING HEADER MONETA (DARK SLATE)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 34, 'F');

  // LOAD LOGO DARI /public/icon-512x512.png
  try {
    const logoBase64 = await loadImageAsBase64('/icon-512x512.png');
    doc.addImage(logoBase64, 'PNG', 14, 7, 20, 20);
  } catch (err) {
    console.warn('Gagal memuat logo PNG, fallback ke teks:', err);
  }

  // TITLE BRAND & SLOGAN
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Moneta', 38, 18);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Laporan Ringkasan Keuangan & Arus Kas', 38, 23);

  // INFO CETAK & USER (KANAN HEADER)
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Dicetak: ${today}`, 196, 16, { align: 'right' });
  if (userEmail) {
    doc.text(`Pemilik: ${userName}`, 196, 20.5, { align: 'right' });
    doc.text(`Email: ${userEmail}`, 196, 25, { align: 'right' });
  }

  // 2. JUDUL PERIODE
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`PERIODE LAPORAN: ${periodText.toUpperCase()}`, 14, 43);

  // 3. RINGKASAN SALDO & ARUS KAS (CARD BOX)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(14, 47, 182, 22, 3, 3, 'FD');

  // Total Pemasukan
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL PEMASUKAN', 20, 53);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // emerald
  doc.text(formatRupiah(totalIncome), 20, 62);

  // Total Pengeluaran
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL PENGELUARAN', 80, 53);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72); // rose
  doc.text(formatRupiah(totalExpense), 80, 62);

  // Arus Kas Bersih
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('ARUS KAS BERSIH', 140, 53);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(netBalance >= 0 ? 15 : 225, netBalance >= 0 ? 23 : 29, netBalance >= 0 ? 42 : 72);
  doc.text(`${netBalance >= 0 ? '+' : ''}${formatRupiah(netBalance)}`, 140, 62);

  // 4. TABEL MUTASI TRANSAKSI
  const tableData = transactions.map((tx, idx) => {
    const formattedDate = new Date(tx.date || tx.createdAt).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const isTransfer = tx.type === 'TRANSFER' || String(tx.category?.name).toLowerCase().includes('transfer');
    const isIncome = tx.type === 'INCOME';

    let typeLabel = isTransfer ? 'TRANSFER' : isIncome ? 'PEMASUKAN' : 'PENGELUARAN';
    let amountStr = `${isTransfer ? '' : isIncome ? '+' : '-'}${formatRupiah(Number(tx.amount || 0))}`;

    return [
      idx + 1,
      formattedDate,
      tx.description || tx.notes || '-',
      tx.category?.name || 'Umum',
      tx.wallet?.name || 'Dompet Utama',
      typeLabel,
      amountStr,
    ];
  });

  autoTable(doc, {
    startY: 75,
    head: [['No', 'Tanggal', 'Deskripsi / Catatan', 'Kategori', 'Dompet', 'Tipe', 'Nominal']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 26 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 28 },
      4: { cellWidth: 28 },
      5: { cellWidth: 25 },
      6: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 6) {
        const rowText = String(data.cell.raw);
        if (rowText.startsWith('+')) {
          data.cell.styles.textColor = [16, 185, 129];
        } else if (rowText.startsWith('-')) {
          data.cell.styles.textColor = [225, 29, 72];
        } else {
          data.cell.styles.textColor = [71, 85, 105];
        }
      }
    },
    margin: { top: 75, bottom: 20, left: 14, right: 14 },
  });

  // 5. FOOTER NUMERASI
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Moneta Financial Report — Halaman ${i} dari ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }

  if (returnBlob) {
    return doc.output('bloburl');
  }

  doc.save(`Moneta_Laporan_${periodText.replace(/ /g, '_')}.pdf`);
};