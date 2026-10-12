'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { RevenueOverTimeChart } from './RevenueOverTimeChart';
import { BookingsFunnelChart } from './BookingsFunnelChart';
import { TopProvidersChart } from './TopProvidersChart';
import { CategoryPerformanceChart } from './CategoryPerformanceChart';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('Last 7 days');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

  const timeRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  const timeOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Year to date', 'All time'];
  const categoryOptions = ['All Categories', 'Experiences', 'Stay', 'Flight', 'Insurance'];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (timeRef.current && !timeRef.current.contains(e.target as Node)) {
        setIsTimeDropdownOpen(false);
      }
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setIsCatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* Analytics Page Header matching Container.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
            Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            Platform performance insights
          </p>
        </div>

        {/* Filter Dropdowns matching Container.png */}
        <div className="flex items-center gap-3">
          {/* Time Range Filter */}
          <div className="relative" ref={timeRef}>
            <button
              onClick={() => {
                setIsTimeDropdownOpen(!isTimeDropdownOpen);
                setIsCatDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200/90 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs focus:outline-hidden"
            >
              <span>{timeRange}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {isTimeDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                {timeOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setTimeRange(opt);
                      setIsTimeDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>{opt}</span>
                    {timeRange === opt && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="relative" ref={catRef}>
            <button
              onClick={() => {
                setIsCatDropdownOpen(!isCatDropdownOpen);
                setIsTimeDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200/90 rounded-lg text-sm text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs focus:outline-hidden"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {isCatDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedCategory(opt);
                      setIsCatDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <span>{opt}</span>
                    {selectedCategory === opt && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2x2 Cards Grid matching Container.png */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top-Left: Revenue Over Time */}
        <div className="flex flex-col">
          <RevenueOverTimeChart timeRange={timeRange} category={selectedCategory} />
        </div>

        {/* Top-Right: Bookings Funnel */}
        <div className="flex flex-col">
          <BookingsFunnelChart />
        </div>

        {/* Bottom-Left: Top Providers */}
        <div className="flex flex-col">
          <TopProvidersChart />
        </div>

        {/* Bottom-Right: Category Performance */}
        <div className="flex flex-col">
          <CategoryPerformanceChart />
        </div>
      </div>
    </div>
  );
};
