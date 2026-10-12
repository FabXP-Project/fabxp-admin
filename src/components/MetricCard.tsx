'use client';

import React from 'react';
import { Calendar, Clock, Users, Handshake, ArrowUpRight } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: string;
  iconType: 'bookings' | 'gmv' | 'approvals' | 'providers' | 'partners';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  iconType,
  onClick,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'bookings':
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 stroke-[1.9]" />
          </div>
        );
      case 'gmv':
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
            <span className="text-lg font-bold">₹</span>
          </div>
        );
      case 'approvals':
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 stroke-[1.9]" />
          </div>
        );
      case 'providers':
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 stroke-[1.9]" />
          </div>
        );
      case 'partners':
        return (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
            <Handshake className="w-5 h-5 stroke-[1.9]" />
          </div>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col justify-between transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-xs' : ''
      }`}
    >
      {/* Top row: Label and Icon */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs sm:text-sm font-medium text-slate-600 leading-snug">
          {title}
        </span>
        {renderIcon()}
      </div>

      {/* Middle row: Large metric value */}
      <div className="mt-3">
        <div className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight tabular-nums leading-none">
          {value}
        </div>

        {/* Bottom row: Trend or spacer */}
        {trend ? (
          <div className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-2">
            <span>↑</span>
            <span>{trend}</span>
          </div>
        ) : (
          <div className="h-4 mt-2" aria-hidden="true" />
        )}
      </div>
    </div>
  );
};
