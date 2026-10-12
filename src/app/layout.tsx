import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '@/src/index.css';
import { AdminProvider } from '@/src/context/AdminContext';
import { AppShell } from '@/src/components/layout/AppShell';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'FabXP Admin Dashboard',
  description: 'Operations, revenue analytics, and bookings management dashboard for FabXP.',
  openGraph: {
    title: 'FabXP Admin Dashboard',
    description: 'Operations, revenue analytics, and bookings management dashboard for FabXP.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FabXP Admin Dashboard',
    description: 'Operations, revenue analytics, and bookings management dashboard for FabXP.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="min-h-screen bg-[#F8FAFC] antialiased text-slate-800 font-sans">
        <AdminProvider>
          <AppShell>{children}</AppShell>
        </AdminProvider>
      </body>
    </html>
  );
}
