export interface Booking {
  id: string;
  user: string;
  customer?: string;
  listing: string;
  date: string;
  groupSize?: number;
  amount: number;
  currency: string;
  status: 'Completed' | 'Upcoming' | 'Pending' | 'Cancelled' | 'No-Show';
  category?: 'Experiences' | 'Stay' | 'Flight' | 'Insurance';
  email?: string;
  phone?: string;
  paymentMethod?: string;
}

export interface CommissionDefaults {
  experiences: number;
  stay: number;
  flight: number;
  insurance: number;
}

export interface CustomCommissionOverride {
  id: string;
  partner: string;
  category: string;
  customRate: number;
}

export interface ListingItem {
  id: string;
  title: string;
  category: 'Experience' | 'Stay' | 'Flight' | 'Insurance';
  submittedBy: string;
  location: string;
  priceFormatted: string;
  price: number;
  status: 'Live' | 'Pending' | 'Draft' | 'Rejected';
  date: string;
}

export interface PayoutItem {
  id: string;
  provider: string;
  grossBookingValue: number;
  grossFormatted: string;
  commission: number;
  commissionFormatted: string;
  netPayout: number;
  netPayoutFormatted: string;
  status: 'Pending' | 'Paid';
}

export interface UserManagementItem {
  id: string;
  name: string;
  role: 'Provider' | 'Partner';
  email: string;
  phone: string;
  listingsCount: number;
  status: 'Active' | 'Suspended';
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  platformUrl: string;
  newBookingAlerts: boolean;
  payoutReminders: boolean;
  listingSubmissions: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  category: 'Approvals' | 'Bookings' | 'Payouts' | 'Errors';
  type: 'listing-approved' | 'listing-rejected' | 'new-booking' | 'payout-processed' | 'api-error';
  read: boolean;
}

export interface ApprovalItem {
  id: string;
  title: string;
  provider: string;
  submittedAt: string;
  category: string;
  location: string;
  proposedPrice: number;
  priceFormatted?: string;
  approved?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface MetricData {
  title: string;
  value: string;
  trend?: string;
  trendType?: 'positive' | 'neutral' | 'negative';
  iconType: 'bookings' | 'gmv' | 'approvals' | 'providers' | 'partners';
}

export interface RevenueDataPoint {
  day: string;
  shortDay: string;
  revenue: number; // in thousands or rupees
  formatted: string;
}

export interface CategoryDataPoint {
  name: string;
  percentage: number;
  color: string;
  value: string;
  count: number;
}
