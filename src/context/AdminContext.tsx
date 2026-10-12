'use client';

import React, { createContext, useContext, useState, useEffect, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
} from '@/src/types/dashboard';
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
} from '@/src/data/mockData';
import {
  approveListingAction,
  rejectListingAction,
  undoApprovalAction,
  approveAllListingsAction,
  approvePayoutAction,
  saveCommissionDefaultsAction,
  updateOverrideAction,
  addOverrideAction,
  saveSettingsAction,
  addUserAction,
  toggleUserStatusAction,
  updateUserAction,
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from '@/src/server/actions';

interface AdminContextType {
  // Navigation
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Auth
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  authView: string;
  setAuthView: (view: string) => void;
  authEmail: string;
  setAuthEmail: (email: string) => void;
  handleLogin: (email: string) => void;
  handleLogout: () => void;

  // Modals
  selectedBooking: Booking | null;
  setSelectedBooking: (b: Booking | null) => void;
  isAllApprovalsOpen: boolean;
  setIsAllApprovalsOpen: (open: boolean) => void;

  // Data states & actions
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;

  approvals: ApprovalItem[];
  approvedIds: Set<string>;
  rejectedIds: Set<string>;
  pendingApprovalsCount: number;
  handleApprove: (id: string, title: string) => void;
  handleReject: (id: string, title: string) => void;
  handleUndo: (id: string) => void;
  handleApproveAll: () => void;

  payouts: PayoutItem[];
  handleApprovePayout: (id: string, provider: string, amount: string) => void;

  commissionDefaults: CommissionDefaults;
  customOverrides: CustomCommissionOverride[];
  handleSaveDefaults: (newDefaults: CommissionDefaults) => void;
  handleUpdateOverride: (id: string, newRate: number) => void;
  handleAddOverride: (partner: string, category: string, rate: number) => void;

  listings: ListingItem[];
  setListings: React.Dispatch<React.SetStateAction<ListingItem[]>>;

  users: UserManagementItem[];
  handleAddUser: (userData: Omit<UserManagementItem, 'id' | 'listingsCount'>) => void;
  handleToggleUserStatus: (id: string) => void;
  handleUpdateUser: (id: string, updated: Partial<UserManagementItem>) => void;

  settings: PlatformSettings;
  handleSaveSettings: (newSettings: PlatformSettings) => void;

  notifications: AppNotification[];
  unreadNotificationsCount: number;
  handleMarkAllNotificationsAsRead: () => void;
  handleMarkNotificationAsRead: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({
  children,
  initialBookings,
  initialApprovals,
  initialCommissionDefaults,
  initialCustomOverrides,
  initialListings,
  initialPayouts,
  initialSettings,
  initialUsers,
  initialNotifications,
}: {
  children: React.ReactNode;
  initialBookings?: Booking[];
  initialApprovals?: ApprovalItem[];
  initialCommissionDefaults?: CommissionDefaults;
  initialCustomOverrides?: CustomCommissionOverride[];
  initialListings?: ListingItem[];
  initialPayouts?: PayoutItem[];
  initialSettings?: PlatformSettings;
  initialUsers?: UserManagementItem[];
  initialNotifications?: AppNotification[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  // Determine current tab from pathname
  const getTabFromPath = (path: string): string => {
    if (path === '/' || path === '') return 'dashboard';
    if (path.startsWith('/users/add-provider') || path === '/add-provider') return 'add-provider';
    if (path.startsWith('/users')) return 'users';
    if (path.startsWith('/bookings')) return 'bookings';
    if (path.startsWith('/approvals')) return 'approvals';
    if (path.startsWith('/commission')) return 'commission';
    if (path.startsWith('/listings')) return 'listings';
    if (path.startsWith('/payouts')) return 'payouts';
    if (path.startsWith('/analytics')) return 'analytics';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/notifications')) return 'notifications';
    return 'dashboard';
  };

  const [currentTab, setTabState] = useState<string>(() => getTabFromPath(pathname));
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync tab with pathname on URL change
  useEffect(() => {
    setTabState(getTabFromPath(pathname));
  }, [pathname]);

  const setCurrentTab = (tab: string) => {
    setTabState(tab);
    // Navigate via Next.js router
    if (tab === 'dashboard') router.push('/');
    else if (tab === 'add-provider') router.push('/users/add-provider');
    else router.push(`/${tab}`);
  };

  const toggleMobileNav = () => setIsMobileNavOpen((prev) => !prev);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authView, setAuthView] = useState<string>('login');
  const [authEmail, setAuthEmail] = useState<string>('admin@fabxp.com');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogin = (email: string) => {
    setAuthEmail(email);
    setIsAuthenticated(true);
    showToast(`Welcome back! Signed in as ${email}`);
    router.push('/');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView('login');
    showToast('Administrator session locked');
    router.push('/login');
  };

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isAllApprovalsOpen, setIsAllApprovalsOpen] = useState(false);

  // Data collections (initialized from props or server-side defaults)
  const [bookings, setBookings] = useState<Booking[]>(initialBookings || INITIAL_BOOKINGS);
  const [approvals] = useState<ApprovalItem[]>(initialApprovals || INITIAL_APPROVALS);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  const [commissionDefaults, setCommissionDefaults] = useState<CommissionDefaults>(
    initialCommissionDefaults || INITIAL_COMMISSION_DEFAULTS
  );
  const [customOverrides, setCustomOverrides] = useState<CustomCommissionOverride[]>(
    initialCustomOverrides || INITIAL_CUSTOM_OVERRIDES
  );
  const [listings, setListings] = useState<ListingItem[]>(initialListings || INITIAL_LISTINGS);
  const [payouts, setPayouts] = useState<PayoutItem[]>(initialPayouts || INITIAL_PAYOUTS);
  const [settings, setSettings] = useState<PlatformSettings>(initialSettings || INITIAL_SETTINGS);
  const [users, setUsers] = useState<UserManagementItem[]>(initialUsers || INITIAL_USERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    initialNotifications || INITIAL_NOTIFICATIONS
  );

  const pendingApprovalsCount = Math.max(0, approvals.length - approvedIds.size - rejectedIds.size);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Actions wired to Server Actions with optimistic UI updates
  const handleApprove = (id: string, title: string) => {
    setApprovedIds((prev) => new Set(prev).add(id));
    setRejectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast(`Approved "${title}" successfully`);
    startTransition(() => {
      approveListingAction(id, title);
    });
  };

  const handleReject = (id: string, title: string) => {
    setRejectedIds((prev) => new Set(prev).add(id));
    setApprovedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast(`Rejected "${title}"`);
    startTransition(() => {
      rejectListingAction(id, title);
    });
  };

  const handleUndo = (id: string) => {
    setApprovedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setRejectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast('Listing reset to pending');
    startTransition(() => {
      undoApprovalAction(id);
    });
  };

  const handleApproveAll = () => {
    const allIds = new Set(approvals.map((a) => a.id));
    setApprovedIds(allIds);
    setRejectedIds(new Set());
    showToast('All pending listings approved!');
    startTransition(() => {
      approveAllListingsAction();
    });
  };

  const handleApprovePayout = (id: string, provider: string, amount: string) => {
    setPayouts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Paid' as const } : item))
    );
    showToast(`Payout of ${amount} approved for ${provider}!`);
    startTransition(() => {
      approvePayoutAction(id, provider, amount);
    });
  };

  const handleSaveDefaults = (newDefaults: CommissionDefaults) => {
    setCommissionDefaults(newDefaults);
    showToast('Default category commission rates saved successfully!');
    startTransition(() => {
      saveCommissionDefaultsAction(newDefaults);
    });
  };

  const handleUpdateOverride = (id: string, newRate: number) => {
    setCustomOverrides((prev) =>
      prev.map((item) => (item.id === id ? { ...item, customRate: newRate } : item))
    );
    showToast(`Updated custom rate to ${newRate}%`);
    startTransition(() => {
      updateOverrideAction(id, newRate);
    });
  };

  const handleAddOverride = (partner: string, category: string, rate: number) => {
    const newId = `OVR-${Date.now()}`;
    setCustomOverrides((prev) => [
      ...prev,
      { id: newId, partner, category, customRate: rate },
    ]);
    showToast(`Added custom override for ${partner} (${rate}%)`);
    startTransition(() => {
      addOverrideAction(partner, category, rate);
    });
  };

  const handleSaveSettings = (newSettings: PlatformSettings) => {
    setSettings(newSettings);
    showToast('Platform settings saved successfully!');
    startTransition(() => {
      saveSettingsAction(newSettings);
    });
  };

  const handleAddUser = (userData: Omit<UserManagementItem, 'id' | 'listingsCount'>) => {
    const newUser: UserManagementItem = {
      ...userData,
      id: `USR-${Date.now()}`,
      listingsCount: 0,
    };
    setUsers((prev) => [newUser, ...prev]);
    showToast(`Added new ${userData.role}: ${userData.name}`);
    startTransition(() => {
      addUserAction(userData);
    });
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
          showToast(`Account for ${u.name} is now ${newStatus}`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
    startTransition(() => {
      toggleUserStatusAction(id);
    });
  };

  const handleUpdateUser = (id: string, updated: Partial<UserManagementItem>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
    );
    showToast('User account updated successfully');
    startTransition(() => {
      updateUserAction(id, updated);
    });
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
    startTransition(() => {
      markAllNotificationsReadAction();
    });
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    startTransition(() => {
      markNotificationReadAction(id);
    });
  };

  return (
    <AdminContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        isMobileNavOpen,
        setIsMobileNavOpen,
        toggleMobileNav,
        searchQuery,
        setSearchQuery,
        toastMessage,
        showToast,
        isAuthenticated,
        setIsAuthenticated,
        authView,
        setAuthView,
        authEmail,
        setAuthEmail,
        handleLogin,
        handleLogout,
        selectedBooking,
        setSelectedBooking,
        isAllApprovalsOpen,
        setIsAllApprovalsOpen,
        bookings,
        setBookings,
        approvals,
        approvedIds,
        rejectedIds,
        pendingApprovalsCount,
        handleApprove,
        handleReject,
        handleUndo,
        handleApproveAll,
        payouts,
        handleApprovePayout,
        commissionDefaults,
        customOverrides,
        handleSaveDefaults,
        handleUpdateOverride,
        handleAddOverride,
        listings,
        setListings,
        users,
        handleAddUser,
        handleToggleUserStatus,
        handleUpdateUser,
        settings,
        handleSaveSettings,
        notifications,
        unreadNotificationsCount,
        handleMarkAllNotificationsAsRead,
        handleMarkNotificationAsRead,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
