import { serverDb } from './db';
import { RevenueDataPoint, CategoryDataPoint } from '@/src/types/dashboard';

export async function getAnalyticsData(): Promise<{
  revenueData: RevenueDataPoint[];
  categoryData: CategoryDataPoint[];
  summary: {
    totalRevenue: string;
    totalBookings: number;
    avgOrderValue: string;
    conversionRate: string;
  };
}> {
  return {
    revenueData: serverDb.getRevenueData(),
    categoryData: serverDb.getCategoryData(),
    summary: {
      totalRevenue: '₹14,80,000',
      totalBookings: 128,
      avgOrderValue: '₹3,250',
      conversionRate: '4.8%',
    },
  };
}
