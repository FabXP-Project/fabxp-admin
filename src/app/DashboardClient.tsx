'use client';

import React from 'react';
import { useAdmin } from '@/src/context/AdminContext';
import { MetricCard } from '@/src/components/MetricCard';
import { RevenueChart } from '@/src/components/RevenueChart';
import { CategoryDistribution } from '@/src/components/CategoryDistribution';
import { RecentBookingsTable } from '@/src/components/RecentBookingsTable';
import { PendingApprovalsCard } from '@/src/components/PendingApprovalsCard';
import { DashboardApiResponse } from '@/src/lib/api/types';

interface DashboardClientProps {
  initialData: DashboardApiResponse;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ initialData }) => {
  const {
    setCurrentTab,
    searchQuery,
    bookings,
    setSelectedBooking,
    approvals,
    approvedIds,
    handleApprove,
    setIsAllApprovalsOpen,
    pendingApprovalsCount,
  } = useAdmin();

  return (
    <>
      {/* Dashboard Header Greeting matching original */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
          Welcome back, Super Admin
        </p>
      </div>

      {/* 5 KPI Metric Cards Strip matching original */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 1. Total Bookings Today */}
        <MetricCard
          title="Total Bookings Today"
          value={initialData.metrics.totalBookingsToday.value}
          trend={initialData.metrics.totalBookingsToday.trend}
          iconType="bookings"
          onClick={() => setCurrentTab('bookings')}
        />

        {/* 2. GMV Today */}
        <MetricCard
          title="GMV Today"
          value={initialData.metrics.gmvToday.value}
          trend={initialData.metrics.gmvToday.trend}
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
          value={initialData.metrics.activeProviders.value}
          trend={initialData.metrics.activeProviders.trend}
          iconType="providers"
          onClick={() => setCurrentTab('users')}
        />

        {/* 5. Active Partners */}
        <MetricCard
          title="Active Partners"
          value={initialData.metrics.activePartners.value}
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
  );
};
