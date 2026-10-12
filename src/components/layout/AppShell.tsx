'use client';

import React from 'react';
import { useAdmin } from '@/src/context/AdminContext';
import { Sidebar } from '@/src/components/Sidebar';
import { Header } from '@/src/components/Header';
import { BookingDetailsModal } from '@/src/components/BookingDetailsModal';
import { AllApprovalsModal } from '@/src/components/AllApprovalsModal';
import { CheckCircle2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentTab,
    setCurrentTab,
    isMobileNavOpen,
    setIsMobileNavOpen,
    toggleMobileNav,
    searchQuery,
    setSearchQuery,
    unreadNotificationsCount,
    handleLogout,
    toastMessage,
    selectedBooking,
    setSelectedBooking,
    isAllApprovalsOpen,
    setIsAllApprovalsOpen,
    approvals,
    approvedIds,
    handleApprove,
    handleApproveAll,
    pendingApprovalsCount,
  } = useAdmin();

  const pathname = usePathname();
  const router = useRouter();

  // If path is auth route (login, forgot-password, reset-password, 2fa), do not render admin shell
  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/2fa');

  if (isAuthPage) {
    return <>{children}</>;
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
          onToggleMobileNav={toggleMobileNav}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadNotifications={unreadNotificationsCount}
          onOpenNotifications={() => setCurrentTab('notifications')}
          onLogout={handleLogout}
          onNavigateSettings={() => setCurrentTab('settings')}
          onNavigateUsers={() => setCurrentTab('users')}
          onNavigateResetPassword={() => router.push('/reset-password')}
          onNavigate2FA={() => router.push('/2fa-verify')}
          onNavigate2FASetup={() => router.push('/2fa-setup')}
        />

        {/* Canvas Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {children}
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
};
