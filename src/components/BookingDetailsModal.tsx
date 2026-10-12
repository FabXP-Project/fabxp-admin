'use client';

import React from 'react';
import { X, Calendar, User, CreditCard, Mail, Phone, Tag, CheckCircle2 } from 'lucide-react';
import { Booking } from '../types/dashboard';

interface BookingDetailsModalProps {
  booking: Booking | null;
  onClose: () => void;
  onUpdateStatus?: (id: string, newStatus: Booking['status']) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  onClose,
  onUpdateStatus,
}) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-[#0B2545]">{booking.id}</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                booking.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : booking.status === 'Upcoming'
                  ? 'bg-blue-50 text-blue-700'
                  : booking.status === 'No-Show'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {booking.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{booking.listing}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Category: {booking.category || 'Experience'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-100 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Customer</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {booking.user}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Date of Booking</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {booking.date}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Amount Paid</span>
              <span className="text-base font-bold text-slate-900 block mt-0.5 tabular-nums">
                {booking.currency}{booking.amount.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Group Size</span>
              <span className="font-semibold text-slate-800 block mt-0.5 tabular-nums">
                {booking.groupSize ?? 1} guest{(booking.groupSize ?? 1) > 1 ? 's' : ''}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Payment Method</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                {booking.paymentMethod || 'Online Gateway'}
              </span>
            </div>
          </div>

          {booking.email && (
            <div className="text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{booking.email}</span>
              </div>
              {booking.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">Platform Commission: 12%</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0B2545] rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
