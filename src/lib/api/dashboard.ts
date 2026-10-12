import { serverDb } from './db';
import { DashboardApiResponse } from './types';

export async function getDashboardData(): Promise<DashboardApiResponse> {
  const approvals = serverDb.getApprovals();
  const approvedIds = new Set(serverDb.getApprovedIds());
  const rejectedIds = new Set(serverDb.getRejectedIds());
  const pendingCount = Math.max(0, approvals.length - approvedIds.size - rejectedIds.size);

  const bookings = serverDb.getBookings();
  const revenueData = serverDb.getRevenueData();
  const categoryData = serverDb.getCategoryData();

  return {
    metrics: {
      totalBookingsToday: {
        title: 'Total Bookings Today',
        value: '128',
        trend: '12% vs yesterday',
        iconType: 'bookings',
      },
      gmvToday: {
        title: 'GMV Today',
        value: '₹2,45,000',
        trend: '8% vs yesterday',
        iconType: 'gmv',
      },
      pendingApprovals: {
        title: 'Pending Approvals',
        value: pendingCount.toString(),
        iconType: 'approvals',
      },
      activeProviders: {
        title: 'Active Providers',
        value: '52',
        trend: '3 new this week',
        iconType: 'providers',
      },
      activePartners: {
        title: 'Active Partners',
        value: '18',
        iconType: 'partners',
      },
    },
    revenueData,
    categoryData,
    recentBookings: bookings.slice(0, 10),
    pendingApprovals: approvals,
  };
}
