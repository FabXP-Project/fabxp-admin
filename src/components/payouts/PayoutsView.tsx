'use client';

import React from 'react';
import { PayoutItem } from '../../types/dashboard';

interface PayoutsViewProps {
  payouts: PayoutItem[];
  onApprovePayout: (id: string, provider: string, amount: string) => void;
  searchFilter?: string;
}

export const PayoutsView: React.FC<PayoutsViewProps> = ({
  payouts,
  onApprovePayout,
  searchFilter = '',
}) => {
  const filteredPayouts = payouts.filter((item) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.provider.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header matching payouts.png */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
          Payouts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
          Manage provider and partner payouts
        </p>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        {/* Title inside card */}
        <h2 className="text-base font-bold text-slate-900 tracking-tight mb-6">
          Payout Queue
        </h2>

        {/* Table matching payouts.png */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-400">
                <th className="pb-3.5 font-medium">Provider / Partner</th>
                <th className="pb-3.5 font-medium">Gross Booking Value</th>
                <th className="pb-3.5 font-medium">Commission</th>
                <th className="pb-3.5 font-medium">Net Payout</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 font-medium text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90 text-sm">
              {filteredPayouts.map((row) => {
                const isPending = row.status === 'Pending';

                return (
                  <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Provider / Partner */}
                    <td className="py-4 font-bold text-slate-900">
                      {row.provider}
                    </td>

                    {/* Gross Booking Value */}
                    <td className="py-4 font-medium text-slate-700 tabular-nums">
                      {row.grossFormatted}
                    </td>

                    {/* Commission (Red text matching screenshot) */}
                    <td className="py-4 font-medium text-[#EF4444] tabular-nums">
                      {row.commissionFormatted}
                    </td>

                    {/* Net Payout (Bold dark text) */}
                    <td className="py-4 font-bold text-slate-900 tabular-nums">
                      {row.netPayoutFormatted}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 whitespace-nowrap">
                      {isPending ? (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#FEF7EC] text-[#D97706] border border-[#FDE68A]/60">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#16A34A] border border-[#C5EAD0]/60">
                          Paid
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 text-right pr-2">
                      {isPending ? (
                        <button
                          onClick={() => onApprovePayout(row.id, row.provider, row.netPayoutFormatted)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-98 transition-all shadow-xs cursor-pointer"
                        >
                          <svg
                            className="w-3.5 h-3.5 stroke-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="9 12 11 14 15 10" />
                          </svg>
                          <span>Approve</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
