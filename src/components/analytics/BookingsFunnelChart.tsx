'use client';

import React, { useState } from 'react';

export const BookingsFunnelChart: React.FC = () => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const stages = [
    { name: 'Views', count: 12600, percentage: 90.0, dropoff: 'Initial' },
    { name: 'Clicks', count: 5800, percentage: 41.4, dropoff: '46.0% from Views' },
    { name: 'Add to Cart', count: 1900, percentage: 13.6, dropoff: '32.8% from Clicks' },
    { name: 'Checkout', count: 1250, percentage: 8.9, dropoff: '65.8% from Cart' },
    { name: 'Booked', count: 850, percentage: 6.1, dropoff: '68.0% from Checkout' },
  ];

  const maxVal = 14000;
  const xTicks = [0, 3500, 7000, 10500, 14000];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Bookings Funnel
        </h3>
        <span className="text-xs text-slate-400 font-medium hidden sm:block">
          Overall Conversion: <strong className="text-slate-700">6.7%</strong>
        </span>
      </div>

      {/* Funnel Rows */}
      <div className="space-y-3.5 my-auto py-2">
        {stages.map((stage) => {
          const isHovered = hoveredStage === stage.name;
          const barWidthPercent = (stage.count / maxVal) * 100;

          return (
            <div
              key={stage.name}
              className="flex items-center gap-3 text-xs group cursor-pointer"
              onMouseEnter={() => setHoveredStage(stage.name)}
              onMouseLeave={() => setHoveredStage(null)}
            >
              {/* Stage label (left side) */}
              <div className="w-20 sm:w-24 text-right font-medium text-slate-600 truncate shrink-0">
                {stage.name}
              </div>

              {/* Bar track container */}
              <div className="flex-1 relative h-7 bg-transparent rounded-r-md">
                <div
                  className={`h-full rounded-r-md transition-all duration-300 relative flex items-center ${
                    isHovered ? 'bg-[#4338CA] shadow-xs' : 'bg-[#505AF6]'
                  }`}
                  style={{ width: `${barWidthPercent}%` }}
                >
                  {isHovered && (
                    <span className="absolute right-2 text-[10px] text-white font-bold tabular-nums">
                      {stage.count.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Subtle vertical tick background lines */}
                <div className="absolute inset-0 pointer-events-none flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  {xTicks.map((tick) => (
                    <div
                      key={tick}
                      className="h-full border-r border-slate-200/60"
                      style={{ left: `${(tick / maxVal) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis ticks at bottom matching Container.png */}
      <div className="flex items-center pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
        {/* Spacer for label alignment */}
        <div className="w-20 sm:w-24 shrink-0" />

        {/* X-axis tick values: 0, 3500, 7000, 10500, 14000 */}
        <div className="flex-1 flex justify-between px-0.5">
          {xTicks.map((val) => (
            <span key={val} className="tabular-nums">
              {val}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
