'use client';

import React, { useState } from 'react';
import { Calendar, Eye, Search, Filter, CalendarDays, Check } from 'lucide-react';
import { Booking } from '../../types/dashboard';

interface BookingsViewProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  searchFilter?: string;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onSelectBooking,
  searchFilter = '',
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Upcoming' | 'Completed'>('All');
  const [isCalendarView, setIsCalendarView] = useState<boolean>(false);

  // Filter bookings based on activeTab and searchFilter
  const filteredBookings = bookings.filter((b) => {
    // Tab filter
    if (activeTab === 'Upcoming' && b.status !== 'Upcoming') return false;
    if (activeTab === 'Completed' && b.status !== 'Completed') return false;

    // Search filter
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      (b.customer || b.user).toLowerCase().includes(q) ||
      b.listing.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q)
    );
  });

  const renderStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Upcoming':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF3FF] text-[#2563EB] border border-[#BFDBFE]/60">
            Upcoming
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#16A34A] border border-[#C5EAD0]/60">
            Completed
          </span>
        );
      case 'No-Show':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            No-Show
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF7EC] text-[#D97706] border border-[#FDE68A]/60">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header matching booking.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
            Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            All platform bookings
          </p>
        </div>

        {/* Calendar View Button */}
        <button
          onClick={() => setIsCalendarView(!isCalendarView)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all shadow-2xs cursor-pointer ${
            isCalendarView
              ? 'bg-[#0B2545] text-white border-[#0B2545]'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4 stroke-[1.9]" />
          <span>{isCalendarView ? 'Table View' : 'Calendar View'}</span>
        </button>
      </div>

      {isCalendarView ? (
        /* Interactive Calendar Overview */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">March 2026 Reservation Calendar</h3>
            <span className="text-xs text-slate-500">
              {bookings.length} reservations scheduled
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 mb-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const hasBookings = bookings.filter((b) => b.date.includes(`${day} Mar`));
              return (
                <div
                  key={day}
                  className={`min-h-[78px] p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                    hasBookings.length > 0
                      ? 'border-indigo-100 bg-indigo-50/30'
                      : 'border-slate-100 bg-slate-50/30'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-700">{day}</span>
                  {hasBookings.length > 0 && (
                    <div className="space-y-1 mt-1">
                      {hasBookings.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => onSelectBooking(b)}
                          className="text-[10px] bg-white border border-slate-200/80 rounded px-1.5 py-0.5 truncate cursor-pointer hover:border-indigo-400"
                        >
                          {b.listing}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Main Bookings Table Container matching booking.png */
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          {/* Top Segmented Filter Tabs */}
          <div className="bg-[#F8FAFC] border border-slate-100/90 p-1 rounded-xl inline-flex items-center gap-1 mb-6">
            {(['All', 'Upcoming', 'Completed'] as const).map((tab) => (
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

          {/* Table */}
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-400">
                  <th className="pb-3.5 font-medium">Booking ID</th>
                  <th className="pb-3.5 font-medium">Customer</th>
                  <th className="pb-3.5 font-medium">Listing</th>
                  <th className="pb-3.5 font-medium">Date</th>
                  <th className="pb-3.5 font-medium">Group Size</th>
                  <th className="pb-3.5 font-medium">Amount</th>
                  <th className="pb-3.5 font-medium">Status</th>
                  <th className="pb-3.5 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/90 text-sm">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectBooking(booking)}
                    >
                      {/* Booking ID */}
                      <td className="py-4 font-bold text-[#2563EB] tracking-tight group-hover:text-indigo-700 transition-colors">
                        {booking.id}
                      </td>

                      {/* Customer */}
                      <td className="py-4 font-medium text-slate-800">
                        {booking.customer || booking.user}
                      </td>

                      {/* Listing */}
                      <td className="py-4 text-slate-600">
                        {booking.listing}
                      </td>

                      {/* Date */}
                      <td className="py-4 text-slate-500 whitespace-nowrap text-xs sm:text-sm">
                        {booking.date}
                      </td>

                      {/* Group Size */}
                      <td className="py-4 text-slate-700 font-medium tabular-nums pl-4">
                        {booking.groupSize ?? 1}
                      </td>

                      {/* Amount */}
                      <td className="py-4 font-bold text-slate-900 tabular-nums">
                        {booking.currency}
                        {booking.amount.toLocaleString('en-IN')}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 whitespace-nowrap">
                        {renderStatusBadge(booking.status)}
                      </td>

                      {/* Actions: Eye Icon */}
                      <td className="py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBooking(booking);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 stroke-[1.9]" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                      No bookings found for the selected tab or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
