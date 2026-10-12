'use client';

import React, { useState } from 'react';

export const CategoryPerformanceChart: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  // Categories matching Container.png colors & layout:
  // Experiences (45%): Royal Blue #505AF6
  // Stay (28%): Dark Navy #0B2545
  // Flight (18%): Cyan #06B6D4
  // Insurance (9%): Green #16A34A
  const categories = [
    { name: 'Experiences', percentage: 45, color: '#505AF6', value: '₹1,10,250' },
    { name: 'Stay', percentage: 28, color: '#0B2545', value: '₹68,600' },
    { name: 'Flight', percentage: 18, color: '#06B6D4', value: '₹44,100' },
    { name: 'Insurance', percentage: 9, color: '#16A34A', value: '₹22,050' },
  ];

  const size = 180;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2; // radius ~ 77
  const circumference = 2 * Math.PI * radius; // ~ 483.8

  // Segment order for circular positioning: Experiences (45%), Insurance (9%), Flight (18%), Stay (28%)
  const orderedSlices = [
    { ...categories[0] }, // Experiences 45%
    { ...categories[3] }, // Insurance 9%
    { ...categories[2] }, // Flight 18%
    { ...categories[1] }, // Stay 28%
  ];

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Category Performance
        </h3>
      </div>

      {/* Donut Chart */}
      <div className="flex flex-col items-center justify-center my-auto py-2 select-none">
        <div className="relative w-[180px] h-[180px]">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-full transform -rotate-105"
          >
            {orderedSlices.map((slice) => {
              const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += slice.percentage;

              const isHovered = activeSegment === slice.name;

              return (
                <circle
                  key={slice.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setActiveSegment(slice.name)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              );
            })}
          </svg>

          {/* Center text when hovered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            {activeSegment ? (
              (() => {
                const item = categories.find((c) => c.name === activeSegment);
                return (
                  <div className="animate-in fade-in zoom-in-90 duration-150">
                    <span className="text-xs font-semibold text-slate-600 block">
                      {item?.name}
                    </span>
                    <span className="text-lg font-bold text-slate-900 block leading-tight">
                      {item?.percentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {item?.value}
                    </span>
                  </div>
                );
              })()
            ) : (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Total
                </span>
                <span className="text-sm font-bold text-slate-800">100%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend below matching Container.png layout: 2 rows × 2 columns */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 pt-4 text-xs font-medium text-slate-700">
        {categories.map((cat) => {
          const isHovered = activeSegment === cat.name;
          return (
            <div
              key={cat.name}
              onMouseEnter={() => setActiveSegment(cat.name)}
              onMouseLeave={() => setActiveSegment(null)}
              className={`flex items-center justify-between cursor-pointer p-1 rounded-md transition-colors ${
                isHovered ? 'bg-slate-50 font-semibold' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-slate-600 truncate">{cat.name}</span>
              </div>
              <span className="font-bold text-slate-900 tabular-nums ml-2">
                {cat.percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
