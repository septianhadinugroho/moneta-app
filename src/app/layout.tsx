import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import PwaInstallModal from '@/components/ui/PwaInstallModal';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: '#0F3D34',
};

export const metadata: Metadata = {
  title: 'Moneta App - Smart Personal Finance & Expense Tracker',
  description: 'Kelola keuangan pribadi dan catatan pengeluaran dengan cerdas.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-900 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen flex justify-center items-center font-sans`}>
        <Providers>
          {/* MOBILE FRAME CONTAINER DI DESKTOP */}
          <div className="w-full max-w-md min-h-screen bg-slate-50 dark:bg-slate-950 relative shadow-2xl border-x border-slate-200/80 dark:border-slate-800/80 overflow-x-hidden transition-colors duration-200">
            {children}
            <PwaInstallModal />
          </div>
        </Providers>
      </body>
    </html>
  );
}