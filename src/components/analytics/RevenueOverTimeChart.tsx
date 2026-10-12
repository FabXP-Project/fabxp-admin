'use client';

import React, { useState } from 'react';

interface RevenueOverTimeProps {
  timeRange?: string;
  category?: string;
}

export const RevenueOverTimeChart: React.FC<RevenueOverTimeProps> = ({ timeRange = 'Last 7 days', category = 'All Categories' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const svgWidth = 560;
  const svgHeight = 260;
  const paddingLeft = 58;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const baseY = svgHeight - paddingBottom; // y = 215

  const yTicks = [
    { label: '₹600k', val: 600, y: paddingTop },
    { label: '₹450k', val: 450, y: paddingTop + chartHeight * 0.25 },
    { label: '₹300k', val: 300, y: paddingTop + chartHeight * 0.5 },
    { label: '₹150k', val: 150, y: paddingTop + chartHeight * 0.75 },
    { label: '₹0k', val: 0, y: baseY },
  ];

  // Data points matching Container.png:
  // Oct: ~180k, Nov: ~220k, Dec: ~310k, Jan: ~280k, Feb: ~330k, Mar: ~400k
  const monthlyData = [
    { month: 'Oct', revenue: 180, formatted: '₹1,80,000' },
    { month: 'Nov', revenue: 220, formatted: '₹2,20,000' },
    { month: 'Dec', revenue: 310, formatted: '₹3,10,000' },
    { month: 'Jan', revenue: 280, formatted: '₹2,80,000' },
    { month: 'Feb', revenue: 330, formatted: '₹3,30,000' },
    { month: 'Mar', revenue: 400, formatted: '₹4,00,000' },
  ];

  const points = monthlyData.map((item, index) => {
    const x = paddingLeft + (index / (monthlyData.length - 1)) * chartWidth;
    const y = baseY - (item.revenue / 600) * chartHeight;
    return { ...item, x, y };
  });

  // Generate smooth cubic Bézier curve
  const createSmoothPath = (pts: typeof points) => {
    if (pts.length < 2) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const tension = 0.22;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;

      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);
  const firstPt = points[0];
  const lastPt = points[points.length - 1];
  const areaPath = `${linePath} L ${lastPt.x} ${baseY} L ${firstPt.x} ${baseY} Z`;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between h-full">
      {/* Card Title */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Revenue Over Time
        </h3>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full aspect-[560/260] select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="analyticsRevenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#818CF8" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#EEF2FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
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
                x={paddingLeft - 10}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[11px] fill-slate-400 font-medium"
                style={{ fontSize: '11px', fontFamily: 'inherit' }}
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Vertical Grid lines aligned with each month */}
          {points.map((pt, i) => (
            <g key={i}>
              <line
                x1={pt.x}
                y1={paddingTop}
                x2={pt.x}
                y2={baseY}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={pt.x}
                y={baseY + 20}
                textAnchor="middle"
                className="text-[11px] fill-slate-500 font-medium"
                style={{ fontSize: '11px', fontFamily: 'inherit' }}
              >
                {pt.month}
              </text>
            </g>
          ))}

          {/* Shaded Area */}
          <path d={areaPath} fill="url(#analyticsRevenueGradient)" />

          {/* Vibrant Indigo/Royal Blue Curve matching Container.png */}
          <path
            d={linePath}
            fill="none"
            stroke="#4F46E5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive hover points */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <rect
                  x={pt.x - 25}
                  y={paddingTop}
                  width="50"
                  height={chartHeight + 10}
                  fill="transparent"
                />

                {isHovered && (
                  <>
                    <line
                      x1={pt.x}
                      y1={paddingTop}
                      x2={pt.x}
                      y2={baseY}
                      stroke="#4F46E5"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5.5"
                      fill="#4F46E5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute -top-2 z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-lg flex flex-col items-center gap-0.5 whitespace-nowrap"
            style={{
              left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
              top: `${(points[hoveredIndex].y / svgHeight) * 100}%`,
            }}
          >
            <span className="font-semibold">{points[hoveredIndex].formatted}</span>
            <span className="text-[10px] text-slate-300">{points[hoveredIndex].month} Total</span>
            <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1" />
          </div>
        )}
      </div>
    </div>
  );
};
