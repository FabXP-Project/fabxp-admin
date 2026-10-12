import {
  INITIAL_BOOKINGS,
  INITIAL_APPROVALS,
  INITIAL_COMMISSION_DEFAULTS,
  INITIAL_CUSTOM_OVERRIDES,
  INITIAL_LISTINGS,
  INITIAL_PAYOUTS,
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_NOTIFICATIONS,
  REVENUE_DATA,
  CATEGORY_DATA,
} from '@/src/data/mockData';
import {
  Booking,
  ApprovalItem,
  CommissionDefaults,
  CustomCommissionOverride,
  ListingItem,
  PayoutItem,
  PlatformSettings,
  UserManagementItem,
  AppNotification,
  RevenueDataPoint,
  CategoryDataPoint,
} from '@/src/types/dashboard';

// Server-side persistent storage across HMR in Node / Next.js
interface ServerStore {
  bookings: Booking[];
  approvals: ApprovalItem[];
  approvedIds: Set<string>;
  rejectedIds: Set<string>;
  commissionDefaults: CommissionDefaults;
  customOverrides: CustomCommissionOverride[];
  listings: ListingItem[];
  payouts: PayoutItem[];
  settings: PlatformSettings;
  users: UserManagementItem[];
  notifications: AppNotification[];
  revenueData: RevenueDataPoint[];
  categoryData: CategoryDataPoint[];
}

declare global {
  // eslint-disable-next-line no-var
  var __fabxp_store: ServerStore | undefined;
}

function getStore(): ServerStore {
  if (!global.__fabxp_store) {
    global.__fabxp_store = {
      bookings: [...INITIAL_BOOKINGS],
      approvals: [...INITIAL_APPROVALS],
      approvedIds: new Set<string>(),
      rejectedIds: new Set<string>(),
      commissionDefaults: { ...INITIAL_COMMISSION_DEFAULTS },
      customOverrides: [...INITIAL_CUSTOM_OVERRIDES],
      listings: [...INITIAL_LISTINGS],
      payouts: [...INITIAL_PAYOUTS],
      settings: { ...INITIAL_SETTINGS },
      users: [...INITIAL_USERS],
      notifications: [...INITIAL_NOTIFICATIONS],
      revenueData: [...REVENUE_DATA],
      categoryData: [...CATEGORY_DATA],
    };
  }
  return global.__fabxp_store;
}

export const serverDb = {
  // Bookings
  getBookings: () => [...getStore().bookings],
  getBookingById: (id: string) => getStore().bookings.find((b) => b.id === id) || null,
  updateBooking: (id: string, updates: Partial<Booking>) => {
    const store = getStore();
    store.bookings = store.bookings.map((b) => (b.id === id ? { ...b, ...updates } : b));
    return store.bookings.find((b) => b.id === id) || null;
  },

  // Approvals
  getApprovals: () => [...getStore().approvals],
  getApprovedIds: () => Array.from(getStore().approvedIds),
  getRejectedIds: () => Array.from(getStore().rejectedIds),
  approveListing: (id: string) => {
    const store = getStore();
    store.approvedIds.add(id);
    store.rejectedIds.delete(id);
    return { success: true, id };
  },
  rejectListing: (id: string) => {
    const store = getStore();
    store.rejectedIds.add(id);
    store.approvedIds.delete(id);
    return { success: true, id };
  },
  undoApproval: (id: string) => {
    const store = getStore();
    store.approvedIds.delete(id);
    store.rejectedIds.delete(id);
    return { success: true, id };
  },
  approveAllListings: () => {
    const store = getStore();
    store.approvals.forEach((a) => store.approvedIds.add(a.id));
    store.rejectedIds.clear();
    return { success: true, count: store.approvals.length };
  },

  // Commission
  getCommissionDefaults: () => ({ ...getStore().commissionDefaults }),
  setCommissionDefaults: (defaults: CommissionDefaults) => {
    getStore().commissionDefaults = { ...defaults };
    return { ...getStore().commissionDefaults };
  },
  getCustomOverrides: () => [...getStore().customOverrides],
  updateCustomOverride: (id: string, rate: number) => {
    const store = getStore();
    store.customOverrides = store.customOverrides.map((item) =>
      item.id === id ? { ...item, customRate: rate } : item
    );
    return store.customOverrides.find((item) => item.id === id) || null;
  },
  addCustomOverride: (partner: string, category: string, rate: number) => {
    const store = getStore();
    const newOverride: CustomCommissionOverride = {
      id: `OVR-${Date.now()}`,
      partner,
      category,
      customRate: rate,
    };
    store.customOverrides = [newOverride, ...store.customOverrides];
    return newOverride;
  },

  // Listings
  getListings: () => [...getStore().listings],
  updateListing: (id: string, updates: Partial<ListingItem>) => {
    const store = getStore();
    store.listings = store.listings.map((l) => (l.id === id ? { ...l, ...updates } : l));
    return store.listings.find((l) => l.id === id) || null;
  },

  // Payouts
  getPayouts: () => [...getStore().payouts],
  approvePayout: (id: string) => {
    const store = getStore();
    store.payouts = store.payouts.map((p) =>
      p.id === id ? { ...p, status: 'Paid' as const } : p
    );
    return store.payouts.find((p) => p.id === id) || null;
  },

  // Settings
  getSettings: () => ({ ...getStore().settings }),
  updateSettings: (settings: PlatformSettings) => {
    getStore().settings = { ...settings };
    return { ...getStore().settings };
  },

  // Users
  getUsers: () => [...getStore().users],
  addUser: (userData: Omit<UserManagementItem, 'id' | 'listingsCount'>) => {
    const store = getStore();
    const newUser: UserManagementItem = {
      ...userData,
      id: `USR-${Date.now()}`,
      listingsCount: 0,
    };
    store.users = [newUser, ...store.users];
    return newUser;
  },
  toggleUserStatus: (id: string) => {
    const store = getStore();
    store.users = store.users.map((u) => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    });
    return store.users.find((u) => u.id === id) || null;
  },
  updateUser: (id: string, updates: Partial<UserManagementItem>) => {
    const store = getStore();
    store.users = store.users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    return store.users.find((u) => u.id === id) || null;
  },

  // Notifications
  getNotifications: () => [...getStore().notifications],
  markNotificationRead: (id: string) => {
    const store = getStore();
    store.notifications = store.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    return store.notifications.find((n) => n.id === id) || null;
  },
  markAllNotificationsRead: () => {
    const store = getStore();
    store.notifications = store.notifications.map((n) => ({ ...n, read: true }));
    return [...store.notifications];
  },

  // Revenue & Category Data
  getRevenueData: () => [...getStore().revenueData],
  getCategoryData: () => [...getStore().categoryData],
};
