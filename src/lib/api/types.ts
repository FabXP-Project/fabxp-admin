import {
  Booking,
  ApprovalItem,
  CommissionDefaults,
  CustomCommissionOverride,
  ListingItem,
  PayoutItem,
  UserManagementItem,
  PlatformSettings,
  AppNotification,
  MetricData,
  RevenueDataPoint,
  CategoryDataPoint,
} from '@/src/types/dashboard';

export interface DashboardApiResponse {
  metrics: {
    totalBookingsToday: MetricData;
    gmvToday: MetricData;
    pendingApprovals: MetricData;
    activeProviders: MetricData;
    activePartners: MetricData;
  };
  revenueData: RevenueDataPoint[];
  categoryData: CategoryDataPoint[];
  recentBookings: Booking[];
  pendingApprovals: ApprovalItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
