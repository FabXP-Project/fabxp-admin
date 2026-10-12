'use client';

import React, { useState } from 'react';

export const TopProvidersChart: React.FC = () => {
  const [hoveredProvider, setHoveredProvider] = useState<number | null>(null);

  const providers = [
    { name: 'Adventure Co.', bookings: 122, gmv: '₹4,12,000' },
    { name: 'StayPremium', bookings: 95, gmv: '₹3,40,000' },
    { name: 'WaterSports Co.', bookings: 78, gmv: '₹1,95,000' },
    { name: 'FlyRight', bookings: 64, gmv: '₹2,68,000' },
    { name: 'Culture Tours', bookings: 42, gmv: '₹1,15,000' },
  ];

  // SVG dimensions
  const svgWidth = 560;
  const svgHeight = 260;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const baseY = svgHeight - paddingBottom; // y = 215

  const yTicks = [
    { label: '120', val: 120, y: paddingTop },
    { label: '90', val: 90, y: paddingTop + chartHeight * 0.25 },
    { label: '60', val: 60, y: paddingTop + chartHeight * 0.5 },
    { label: '30', val: 30, y: paddingTop + chartHeight * 0.75 },
    { label: '0', val: 0, y: baseY },
  ];

  const barWidth = 46;
  const totalSlots = providers.length;
  const slotWidth = chartWidth / totalSlots;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between h-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Top Providers
        </h3>
        <span className="text-xs text-slate-400 font-medium hidden sm:block">
          By Total Bookings
        </span>
      </div>

      {/* SVG Bar Chart */}
      <div className="relative w-full aspect-[560/260] select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
        >
          {/* Horizontal Dashed Grid lines */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={svgWidth - paddingRight}
                y2={tick.y}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[11px] fill-slate-400 font-medium"
                style={{ fontSize: '11px', fontFamily: 'inherit' }}
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Vertical dashed grid lines */}
          {providers.map((_, i) => {
            const centerX = paddingLeft + i * slotWidth + slotWidth / 2;
            return (
              <line
                key={`vert-${i}`}
                x1={centerX}
                y1={paddingTop}
                x2={centerX}
                y2={baseY}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.6"
              />
            );
          })}

          {/* Bars */}
          {providers.map((p, i) => {
            const centerX = paddingLeft + i * slotWidth + slotWidth / 2;
            const barHeight = (p.bookings / 120) * chartHeight;
            const barY = baseY - barHeight;
            const barX = centerX - barWidth / 2;
            const isHovered = hoveredProvider === i;

            return (
              <g
                key={p.name}
                onMouseEnter={() => setHoveredProvider(i)}
                onMouseLeave={() => setHoveredProvider(null)}
                className="cursor-pointer"
              >
                {/* Hit area */}
                <rect
                  x={centerX - slotWidth / 2}
                  y={paddingTop}
                  width={slotWidth}
                  height={chartHeight + 25}
                  fill="transparent"
                />

                {/* Dark navy bar matching screenshot */}
                <rect
                  x={barX}
                  y={barY}
                  width={barWidth}
                  height={barHeight}
                  rx="3"
                  ry="3"
                  fill={isHovered ? '#1E3A5F' : '#0B2545'}
                  className="transition-colors duration-150"
                />

                {/* Provider Label at bottom */}
                <text
                  x={centerX}
                  y={baseY + 18}
                  textAnchor="middle"
                  className="text-[10.5px] fill-slate-500 font-medium"
                  style={{ fontSize: '10.5px', fontFamily: 'inherit' }}
                >
                  {p.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip */}
        {hoveredProvider !== null && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-lg flex flex-col items-center gap-0.5 whitespace-nowrap"
            style={{
              left: `${
                ((paddingLeft +
                  hoveredProvider * slotWidth +
                  slotWidth / 2) /
                  svgWidth) *
                100
              }%`,
              top: `${
                ((baseY -
                  (providers[hoveredProvider].bookings / 120) * chartHeight) /
                  svgHeight) *
                100
              }%`,
            }}
          >
            <span className="font-semibold">
              {providers[hoveredProvider].name}
            </span>
            <span className="text-[10px] text-slate-300">
              {providers[hoveredProvider].bookings} Bookings · {providers[hoveredProvider].gmv}
            </span>
            <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1" />
          </div>
        )}
      </div>
    </div>
  );
};
