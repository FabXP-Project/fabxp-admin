'use client';

import React from 'react';
import { Check, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { ApprovalItem } from '../types/dashboard';

interface PendingApprovalsCardProps {
  approvals: ApprovalItem[];
  totalPendingCount: number;
  onApprove: (id: string, title: string) => void;
  onViewAll: () => void;
  approvedIds: Set<string>;
}

export const PendingApprovalsCard: React.FC<PendingApprovalsCardProps> = ({
  approvals,
  totalPendingCount,
  onApprove,
  onViewAll,
  approvedIds,
}) => {
  // Take top 3 matching the screenshot
  const displayItems = approvals.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Pending Approvals
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            {totalPendingCount} total
          </span>
        </div>

        {/* List of items */}
        <div className="space-y-4">
          {displayItems.map((item) => {
            const isApproved = approvedIds.has(item.id);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 pt-1"
              >
                {/* Left: Title and provider details */}
                <div className="min-w-0 pr-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {item.provider} · {item.submittedAt}
                  </p>
                </div>

                {/* Right: Approve Button matching screenshot */}
                {isApproved ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 animate-in fade-in zoom-in-95">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Approved
                  </span>
                ) : (
                  <button
                    onClick={() => onApprove(item.id, item.title)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-95 transition-all shrink-0 shadow-xs cursor-pointer"
                  >
                    {/* Check badge icon matching screenshot */}
                    <svg
                      className="w-3.5 h-3.5 stroke-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    <span>Approve</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer link: View all approvals -> */}
      <div className="pt-5 mt-3 border-t border-slate-50 text-center">
        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2545] hover:text-indigo-600 transition-colors group cursor-pointer"
        >
          <span>View all approvals</span>
          <span className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </div>
    </div>
  );
};
