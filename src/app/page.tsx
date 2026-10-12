// Next.js Server Component for Dashboard
import { getDashboardData } from '@/src/lib/api/dashboard';
import { DashboardClient } from './DashboardClient';

export const metadata = {
  title: 'Dashboard | FabXP Admin',
  description: 'Operations, revenue analytics, and bookings management dashboard for FabXP.',
};

export default async function DashboardPage() {
  // Server-side API management
  const initialData = await getDashboardData();

  return <DashboardClient initialData={initialData} />;
}
