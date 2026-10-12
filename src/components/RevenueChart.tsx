'use client';

import React, { useState } from 'react';
import { REVENUE_DATA } from '../data/mockData';

export const RevenueChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Chart Dimensions
  const svgWidth = 600;
  const svgHeight = 240;
  const paddingLeft = 52;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const baseY = svgHeight - paddingBottom; // y = 200

  const yTicks = [
    { label: '₹60k', val: 60, y: paddingTop },
    { label: '₹45k', val: 45, y: paddingTop + chartHeight * 0.25 },
    { label: '₹30k', val: 30, y: paddingTop + chartHeight * 0.5 },
    { label: '₹15k', val: 15, y: paddingTop + chartHeight * 0.75 },
    { label: '₹0k', val: 0, y: baseY },
  ];

  // Calculate coordinates for the 7 points
  const points = REVENUE_DATA.map((item, index) => {
    const x = paddingLeft + (index / (REVENUE_DATA.length - 1)) * chartWidth;
    const y = baseY - (item.revenue / 60) * chartHeight;
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

      // Tension factor
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
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Revenue (Last 7 Days)
        </h3>
        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          Total: <span className="text-slate-700 font-semibold">₹2,47,000</span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full aspect-[600/240] select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" stopOpacity="0.28" />
              <stop offset="70%" stopColor="#C7D2FE" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#EEF2FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines with Y-ticks */}
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

          {/* Vertical Grid lines aligned with each day */}
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
              {/* X-axis day label */}
              <text
                x={pt.x}
                y={baseY + 18}
                textAnchor="middle"
                className="text-[11px] fill-slate-500 font-medium"
                style={{ fontSize: '11px', fontFamily: 'inherit' }}
              >
                {pt.shortDay}
              </text>
            </g>
          ))}

          {/* Shaded Area Fill */}
          <path d={areaPath} fill="url(#revenueGradient)" />

          {/* Smooth Dark Navy Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#0B2545"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover interactive guides & dots */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible wider hit target */}
                <rect
                  x={pt.x - 25}
                  y={paddingTop}
                  width="50"
                  height={chartHeight + 10}
                  fill="transparent"
                />

                {isHovered && (
                  <>
                    {/* Vertical guideline */}
                    <line
                      x1={pt.x}
                      y1={paddingTop}
                      x2={pt.x}
                      y2={baseY}
                      stroke="#4F46E5"
                      strokeWidth="1.5"
                    />
                    {/* Highlighted point circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5.5"
                      fill="#0B2545"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip when hovered */}
        {hoveredIndex !== null && (
          <div
            className="absolute -top-3 z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs shadow-lg flex flex-col items-center gap-0.5 whitespace-nowrap"
            style={{
              left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
              top: `${(points[hoveredIndex].y / svgHeight) * 100}%`,
            }}
          >
            <span className="font-semibold text-white">
              {points[hoveredIndex].formatted}
            </span>
            <span className="text-[10px] text-slate-300">
              {points[hoveredIndex].day}
            </span>
            <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1" />
          </div>
        )}
      </div>
    </div>
  );
};
