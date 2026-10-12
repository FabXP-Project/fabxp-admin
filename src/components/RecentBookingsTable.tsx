'use client';

import React from 'react';
import { Booking } from '../types/dashboard';

interface RecentBookingsTableProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  searchFilter?: string;
}

export const RecentBookingsTable: React.FC<RecentBookingsTableProps> = ({
  bookings,
  onSelectBooking,
  searchFilter = '',
}) => {
  const filteredBookings = bookings.filter((b) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      b.id.toLowerCase().includes(q) ||
      b.user.toLowerCase().includes(q) ||
      b.listing.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q)
    );
  });

  const renderStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#16A34A] border border-[#C6EFD4]/60">
            Completed
          </span>
        );
      case 'Upcoming':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF3FF] text-[#2563EB] border border-[#C2DBFE]/60">
            Upcoming
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF7EC] text-[#D97706] border border-[#FDE68A]/60">
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
            Cancelled
          </span>
        );
      case 'No-Show':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            No-Show
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Recent Bookings
        </h3>
        {searchFilter && (
          <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-full">
            Filtering by &quot;{searchFilter}&quot;
          </span>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-400">
              <th className="pb-3 font-medium">Booking ID</th>
              <th className="pb-3 font-medium">User</th>
              <th className="pb-3 font-medium">Listing</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/90 text-sm">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  onClick={() => onSelectBooking(booking)}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                >
                  {/* Booking ID */}
                  <td className="py-3.5 font-bold text-[#0B2545] tracking-tight group-hover:text-indigo-600 transition-colors">
                    {booking.id}
                  </td>

                  {/* User */}
                  <td className="py-3.5 font-medium text-slate-800">
                    {booking.user}
                  </td>

                  {/* Listing */}
                  <td className="py-3.5 text-slate-600">
                    {booking.listing}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 text-slate-500 whitespace-nowrap text-xs sm:text-sm">
                    {booking.date}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 font-bold text-slate-900 tabular-nums">
                    {booking.currency}
                    {booking.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 whitespace-nowrap">
                    {renderStatusBadge(booking.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                  No bookings matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
