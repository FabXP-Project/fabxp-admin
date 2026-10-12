'use client';

import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  XCircle,
  ShoppingCart,
  Wallet,
  AlertTriangle,
} from 'lucide-react';
import { AppNotification } from '../../types/dashboard';

interface NotificationsViewProps {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  searchFilter?: string;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
  searchFilter = '',
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Approvals' | 'Bookings' | 'Payouts' | 'Errors'>('All');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((item) => {
    // Tab filter
    if (activeTab !== 'All' && item.category !== activeTab) return false;

    // Search filter
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const renderIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'listing-approved':
        return (
          <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[1.9]" />
          </div>
        );
      case 'listing-rejected':
        return (
          <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 stroke-[1.9]" />
          </div>
        );
      case 'new-booking':
        return (
          <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5 stroke-[1.9]" />
          </div>
        );
      case 'payout-processed':
        return (
          <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 stroke-[1.9]" />
          </div>
        );
      case 'api-error':
        return (
          <div className="w-11 h-11 rounded-xl bg-[#FFFBEB] text-[#F59E0B] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[1.9]" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header matching Notifications.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
          </p>
        </div>

        {/* Mark all as read button matching Notifications.png */}
        <button
          onClick={onMarkAllAsRead}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Check className="w-4 h-4 stroke-[2.2] text-slate-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Filter Segmented Tabs matching Notifications.png */}
      <div className="bg-[#F8FAFC] border border-slate-100/90 p-1 rounded-xl inline-flex items-center gap-1 mb-2">
        {(['All', 'Approvals', 'Bookings', 'Payouts', 'Errors'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stack of Notification Cards matching Notifications.png */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => {
            const isUnread = !item.read;

            return (
              <div
                key={item.id}
                onClick={() => isUnread && onMarkAsRead(item.id)}
                className={`bg-white rounded-2xl p-5 flex items-start gap-4 transition-all duration-150 shadow-xs cursor-pointer ${
                  isUnread
                    ? 'border border-indigo-400/80 ring-1 ring-indigo-400/20'
                    : 'border border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Type Icon */}
                {renderIcon(item.type)}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      {item.title}
                    </h3>
                    {isUnread && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#4F46E5] inline-block shrink-0"
                        title="Unread"
                      />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                    {item.description}
                  </p>
                  <span className="text-xs text-slate-400 mt-1.5 block">
                    {item.time}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <p className="text-base font-semibold text-slate-700">No notifications found</p>
            <p className="text-xs text-slate-500 mt-1">There are no notifications for this filter category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
