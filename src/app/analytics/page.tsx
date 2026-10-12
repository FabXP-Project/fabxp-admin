// Server Component for Analytics
import { getAnalyticsData } from '@/src/lib/api/analytics';
import { AnalyticsClient } from './AnalyticsClient';

export const metadata = {
  title: 'Analytics | FabXP Admin',
  description: 'Platform performance insights and revenue analytics for FabXP.',
};

export default async function AnalyticsPage() {
  await getAnalyticsData();
  return <AnalyticsClient />;
}
