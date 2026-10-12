'use client';

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { RevenueChart } from './components/RevenueChart';
import { CategoryDistribution } from './components/CategoryDistribution';
import { RecentBookingsTable } from './components/RecentBookingsTable';
import { PendingApprovalsCard } from './components/PendingApprovalsCard';
import { BookingDetailsModal } from './components/BookingDetailsModal';
import { AllApprovalsModal } from './components/AllApprovalsModal';
import { SecondaryView } from './components/SecondaryViews';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ApprovalsView } from './components/approvals/ApprovalsView';
import { BookingsView } from './components/bookings/BookingsView';
import { CommissionView } from './components/commission/CommissionView';
import { ListingsView } from './components/listings/ListingsView';
import { PayoutsView } from './components/payouts/PayoutsView';
import { SettingsView } from './components/settings/SettingsView';
import { UserManagementView } from './components/users/UserManagementView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { LoginView } from './components/auth/LoginView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';
import { ResetPasswordView } from './components/auth/ResetPasswordView';
import { TwoFactorVerifyView } from './components/auth/TwoFactorVerifyView';
import { TwoFactorSetupView } from './components/auth/TwoFactorSetupView';
import { AddProviderView } from './components/providers/AddProviderView';
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
} from './data/mockData';
import {
  Booking,
  CommissionDefaults,
  CustomCommissionOverride,
  ListingItem,
  PayoutItem,
  PlatformSettings,
  UserManagementItem,
  AppNotification,
} from './types/dashboard';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Authentication state
  type AuthViewType = 'login' | 'forgot-password' | 'reset-password' | '2fa-verify' | '2fa-setup';
  type AuthFlowReason = 'login' | 'forgot-password' | 'setup' | 'standalone';
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authView, setAuthView] = useState<AuthViewType>('login');
  const [authFlowReason, setAuthFlowReason] = useState<AuthFlowReason>('login');
  const [authEmail, setAuthEmail] = useState<string>('admin@fabxp.com');

  const handleLogin = (email: string) => {
    setAuthEmail(email);
    setIsAuthenticated(true);
    showToast(`Welcome back! Signed in as ${email}`);
  };

  const handle2FASuccess = (code: string) => {
    if (authFlowReason === 'forgot-password') {
      showToast('2FA verification successful. Please set your new password.');
      setAuthView('reset-password');
    } else {
      setIsAuthenticated(true);
      showToast(`Identity verified with 2FA code: ${code}. Welcome back!`);
    }
  };

  const handle2FASetupSuccess = () => {
    setIsAuthenticated(true);
    showToast('Two-factor authentication successfully enabled!');
  };

  const handlePasswordResetSuccess = () => {
    showToast('Administrator password updated successfully. Please sign in.');
    setAuthFlowReason('login');
    setAuthView('login');
  };

  const openResetPassword = () => {
    setIsAuthenticated(false);
    setAuthFlowReason('standalone');
    setAuthView('reset-password');
  };

  const open2FA = () => {
    setIsAuthenticated(false);
    setAuthFlowReason('login');
    setAuthView('2fa-verify');
  };

  const open2FASetup = () => {
    setIsAuthenticated(false);
    setAuthFlowReason('setup');
    setAuthView('2fa-setup');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthFlowReason('login');
    setAuthView('login');
    showToast('Administrator session locked');
  };

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Commission state
  const [commissionDefaults, setCommissionDefaults] = useState<CommissionDefaults>(
    INITIAL_COMMISSION_DEFAULTS
  );
  const [customOverrides, setCustomOverrides] = useState<CustomCommissionOverride[]>(
    INITIAL_CUSTOM_OVERRIDES
  );

  // Listings state
  const [listings, setListings] = useState<ListingItem[]>(INITIAL_LISTINGS);

  // Payouts state
  const [payouts, setPayouts] = useState<PayoutItem[]>(INITIAL_PAYOUTS);

  // Settings state
  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);

  // Users state
  const [users, setUsers] = useState<UserManagementItem[]>(INITIAL_USERS);

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Approvals state
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const [isAllApprovalsOpen, setIsAllApprovalsOpen] = useState<boolean>(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleApprovePayout = (id: string, provider: string, amount: string) => {
    setPayouts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Paid' } : item))
    );
    showToast(`Payout of ${amount} approved for ${provider}!`);
  };

  const handleSaveDefaults = (newDefaults: CommissionDefaults) => {
    setCommissionDefaults(newDefaults);
    showToast('Default category commission rates saved successfully!');
  };

  const handleUpdateOverride = (id: string, newRate: number) => {
    setCustomOverrides((prev) =>
      prev.map((item) => (item.id === id ? { ...item, customRate: newRate } : item))
    );
    showToast(`Updated custom rate to ${newRate}%`);
  };

  const handleAddOverride = (partner: string, category: string, rate: number) => {
    const newId = `OVR-${Date.now()}`;
    setCustomOverrides((prev) => [
      ...prev,
      { id: newId, partner, category, customRate: rate },
    ]);
    showToast(`Added custom override for ${partner} (${rate}%)`);
  };

  const handleSaveSettings = (newSettings: PlatformSettings) => {
    setSettings(newSettings);
    showToast('Platform settings saved successfully!');
  };

  const handleAddUser = (userData: Omit<UserManagementItem, 'id' | 'listingsCount'>) => {
    const newUser: UserManagementItem = {
      ...userData,
      id: `USR-${Date.now()}`,
      listingsCount: 0,
    };
    setUsers((prev) => [newUser, ...prev]);
    showToast(`Added new ${userData.role}: ${userData.name}`);
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
  };

  const handleUpdateUser = (id: string, updated: Partial<UserManagementItem>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
    );
    showToast('User account updated successfully');
  };

  const handleApprove = (id: string, title: string) => {
    setApprovedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setRejectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast(`Approved "${title}" successfully`);
  };

  const handleReject = (id: string, title: string) => {
    setRejectedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setApprovedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast(`Rejected "${title}"`);
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
  };

  const handleApproveAll = () => {
    const allIds = new Set(approvals.map((a) => a.id));
    setApprovedIds(allIds);
    setRejectedIds(new Set());
    showToast('All pending listings approved!');
  };

  // Pending count calculations
  const pendingApprovalsCount = Math.max(0, 14 - approvedIds.size - rejectedIds.size);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] antialiased relative">
        {/* Toast message notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-60 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700/50 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Auth Preview Switcher Header */}
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-200/90 shadow-md flex items-center gap-1 text-[11px] font-semibold text-slate-600">
          <span className="hidden sm:inline-block px-1.5 text-slate-400 font-medium">Auth Preview:</span>
          <button
            type="button"
            onClick={() => {
              setAuthFlowReason('login');
              setAuthView('login');
            }}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              authView === 'login'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthFlowReason('forgot-password');
              setAuthView('forgot-password');
            }}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              authView === 'forgot-password'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            Forgot Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthView('2fa-verify');
            }}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              authView === '2fa-verify'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            2FA Verify
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthView('reset-password');
            }}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              authView === 'reset-password'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            Reset Password
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthFlowReason('setup');
              setAuthView('2fa-setup');
            }}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              authView === '2fa-setup'
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            2FA Setup
          </button>
          <span className="h-3 w-px bg-slate-200 mx-0.5" />
          <button
            type="button"
            onClick={() => {
              setIsAuthenticated(true);
              showToast('Returned to Dashboard');
            }}
            className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition-colors cursor-pointer"
            title="Jump directly to Dashboard view"
          >
            Dashboard →
          </button>
        </div>

        {authView === 'login' ? (
          <LoginView
            onLogin={handleLogin}
            onNavigateForgotPassword={() => {
              setAuthFlowReason('forgot-password');
              setAuthView('forgot-password');
            }}
            onNavigateResetPassword={() => {
              setAuthFlowReason('standalone');
              setAuthView('reset-password');
            }}
            onNavigate2FA={() => {
              setAuthFlowReason('login');
              setAuthView('2fa-verify');
            }}
            onNavigate2FASetup={() => {
              setAuthFlowReason('setup');
              setAuthView('2fa-setup');
            }}
          />
        ) : authView === 'forgot-password' ? (
          <ForgotPasswordView
            onBackToLogin={() => {
              setAuthFlowReason('login');
              setAuthView('login');
            }}
            onNavigateResetPassword={() => {
              setAuthFlowReason('forgot-password');
              setAuthView('reset-password');
            }}
            onProceedTo2FA={(email) => {
              setAuthEmail(email);
              setAuthFlowReason('forgot-password');
              setAuthView('2fa-verify');
              showToast(`Security code sent to ${email}. Please verify with 2FA.`);
            }}
          />
        ) : authView === 'reset-password' ? (
          <ResetPasswordView
            userEmail={authEmail}
            onBackToLogin={() => {
              setAuthFlowReason('login');
              setAuthView('login');
            }}
            onPasswordResetSuccess={handlePasswordResetSuccess}
          />
        ) : authView === '2fa-verify' ? (
          <TwoFactorVerifyView
            flowReason={authFlowReason}
            userEmail={authEmail}
            onVerifySuccess={handle2FASuccess}
            onBackToLogin={() => {
              setAuthFlowReason('login');
              setAuthView('login');
            }}
            onBackToForgotPassword={() => {
              setAuthView('forgot-password');
            }}
            onNavigateSetup={() => {
              setAuthFlowReason('setup');
              setAuthView('2fa-setup');
            }}
          />
        ) : (
          <TwoFactorSetupView
            onSetupSuccess={handle2FASetupSuccess}
            onBackToLogin={() => {
              setAuthFlowReason('login');
              setAuthView('login');
            }}
            onNavigateVerify={() => {
              setAuthFlowReason('setup');
              setAuthView('2fa-verify');
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased text-slate-800">
      {/* Toast message notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700/50 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar (Desktop fixed left, Mobile drawer) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        pendingCount={pendingApprovalsCount}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="lg:pl-[240px] flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadNotifications={unreadNotificationsCount}
          onOpenNotifications={() => setCurrentTab('notifications')}
          onLogout={handleLogout}
          onNavigateSettings={() => setCurrentTab('settings')}
          onNavigateUsers={() => setCurrentTab('users')}
          onNavigateResetPassword={openResetPassword}
          onNavigate2FA={open2FA}
          onNavigate2FASetup={open2FASetup}
        />

        {/* Canvas Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {currentTab === 'dashboard' ? (
            <>
              {/* Dashboard Header Greeting matching screenshot */}
              <div>
                <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
                  Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
                  Welcome back, Super Admin
                </p>
              </div>

              {/* 5 KPI Metric Cards Strip matching screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* 1. Total Bookings Today */}
                <MetricCard
                  title="Total Bookings Today"
                  value="128"
                  trend="12% vs yesterday"
                  iconType="bookings"
                  onClick={() => setCurrentTab('bookings')}
                />

                {/* 2. GMV Today */}
                <MetricCard
                  title="GMV Today"
                  value="₹2,45,000"
                  trend="8% vs yesterday"
                  iconType="gmv"
                />

                {/* 3. Pending Approvals */}
                <MetricCard
                  title="Pending Approvals"
                  value={pendingApprovalsCount.toString()}
                  iconType="approvals"
                  onClick={() => setCurrentTab('approvals')}
                />

                {/* 4. Active Providers */}
                <MetricCard
                  title="Active Providers"
                  value="52"
                  trend="3 new this week"
                  iconType="providers"
                  onClick={() => setCurrentTab('users')}
                />

                {/* 5. Active Partners */}
                <MetricCard
                  title="Active Partners"
                  value="18"
                  iconType="partners"
                  onClick={() => setCurrentTab('listings')}
                />
              </div>

              {/* Middle Section: Revenue Chart + Category Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Revenue (Last 7 Days) */}
                <div className="lg:col-span-8 flex flex-col">
                  <RevenueChart />
                </div>

                {/* Category Distribution */}
                <div className="lg:col-span-4 flex flex-col">
                  <CategoryDistribution />
                </div>
              </div>

              {/* Bottom Section: Recent Bookings + Pending Approvals */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Recent Bookings Table */}
                <div className="lg:col-span-8 flex flex-col">
                  <RecentBookingsTable
                    bookings={bookings}
                    onSelectBooking={(b) => setSelectedBooking(b)}
                    searchFilter={searchQuery}
                  />
                </div>

                {/* Pending Approvals Card */}
                <div className="lg:col-span-4 flex flex-col">
                  <PendingApprovalsCard
                    approvals={approvals}
                    totalPendingCount={pendingApprovalsCount}
                    onApprove={handleApprove}
                    onViewAll={() => setCurrentTab('approvals')}
                    approvedIds={approvedIds}
                  />
                </div>
              </div>
            </>
          ) : currentTab === 'add-provider' ? (
            <AddProviderView
              onAddProvider={(provider) => {
                handleAddUser(provider);
                showToast(`Provider "${provider.name}" registered and invitation sent!`);
              }}
              onNavigateToUsers={() => setCurrentTab('users')}
              onBackToDashboard={() => setCurrentTab('dashboard')}
            />
          ) : currentTab === 'analytics' ? (
            <AnalyticsView />
          ) : currentTab === 'approvals' ? (
            <ApprovalsView
              approvals={approvals}
              approvedIds={approvedIds}
              rejectedIds={rejectedIds}
              onApprove={handleApprove}
              onReject={handleReject}
              onUndo={handleUndo}
              searchFilter={searchQuery}
            />
          ) : currentTab === 'bookings' ? (
            <BookingsView
              bookings={bookings}
              onSelectBooking={(b) => setSelectedBooking(b)}
              searchFilter={searchQuery}
            />
          ) : currentTab === 'commission' ? (
            <CommissionView
              defaults={commissionDefaults}
              customOverrides={customOverrides}
              onSaveDefaults={handleSaveDefaults}
              onUpdateOverride={handleUpdateOverride}
              onAddOverride={handleAddOverride}
            />
          ) : currentTab === 'listings' ? (
            <ListingsView
              listings={listings}
              searchFilter={searchQuery}
            />
          ) : currentTab === 'payouts' ? (
            <PayoutsView
              payouts={payouts}
              onApprovePayout={handleApprovePayout}
              searchFilter={searchQuery}
            />
          ) : currentTab === 'users' ? (
            <UserManagementView
              users={users}
              onAddUser={handleAddUser}
              onToggleStatus={handleToggleUserStatus}
              onUpdateUser={handleUpdateUser}
              searchFilter={searchQuery}
              onNavigateAddProvider={() => setCurrentTab('add-provider')}
            />
          ) : currentTab === 'settings' ? (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onNavigateResetPassword={openResetPassword}
              onNavigate2FA={open2FA}
              onNavigate2FASetup={open2FASetup}
            />
          ) : currentTab === 'notifications' ? (
            <NotificationsView
              notifications={notifications}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onMarkAsRead={handleMarkNotificationAsRead}
              searchFilter={searchQuery}
            />
          ) : (
            <SecondaryView
              tab={currentTab}
              onBackToDashboard={() => setCurrentTab('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
      />

      {/* All Approvals Modal */}
      <AllApprovalsModal
        isOpen={isAllApprovalsOpen}
        onClose={() => setIsAllApprovalsOpen(false)}
        approvals={approvals}
        approvedIds={approvedIds}
        onApprove={handleApprove}
        onApproveAll={handleApproveAll}
      />
    </div>
  );
}
