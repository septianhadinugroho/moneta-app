import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import PwaInstallModal from '@/components/ui/PwaInstallModal';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
    <html lang="id" suppressHydrationWarning className={inter.className}>
      <body className="bg-slate-900 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen flex justify-center items-center font-sans">
        <Providers>
          {/* MOBILE FRAME CONTAINER */}
          <div className="w-full max-w-md min-h-screen bg-slate-50 dark:bg-slate-950 relative shadow-2xl border-x border-slate-200 dark:border-slate-800 transition-colors duration-200 flex flex-col">
            {children}
            <PwaInstallModal />
          </div>
        </Providers>
      </body>
    </html>
  );
}