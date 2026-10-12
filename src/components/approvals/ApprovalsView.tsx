'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, MapPin, X, CheckCircle2, RotateCcw } from 'lucide-react';
import { ApprovalItem } from '../../types/dashboard';

interface ApprovalsViewProps {
  approvals: ApprovalItem[];
  approvedIds: Set<string>;
  rejectedIds: Set<string>;
  onApprove: (id: string, title: string) => void;
  onReject: (id: string, title: string) => void;
  onUndo: (id: string) => void;
  searchFilter?: string;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  approvals,
  approvedIds,
  rejectedIds,
  onApprove,
  onReject,
  onUndo,
  searchFilter = '',
}) => {
  const [selectedItemForReject, setSelectedItemForReject] = useState<ApprovalItem | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Incomplete safety documentation');

  const filteredApprovals = approvals.filter((item) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.provider.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleConfirmReject = () => {
    if (selectedItemForReject) {
      onReject(selectedItemForReject.id, selectedItemForReject.title);
      setSelectedItemForReject(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header matching approvals.png */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
          Approvals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
          Review and approve pending listings
        </p>
      </div>

      {/* Stack of Listing Cards */}
      <div className="space-y-4">
        {filteredApprovals.length > 0 ? (
          filteredApprovals.map((item) => {
            const isApproved = approvedIds.has(item.id);
            const isRejected = rejectedIds.has(item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all shadow-2xs hover:shadow-xs"
              >
                {/* Left section: Thumbnail + Details */}
                <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
                  {/* Image placeholder container matching approvals.png */}
                  <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl bg-[#F8FAFC] border border-slate-200/70 flex items-center justify-center shrink-0 text-slate-400">
                    <ImageIcon className="w-7 h-7 stroke-[1.6]" />
                  </div>

                  {/* Info block */}
                  <div className="min-w-0 space-y-1.5">
                    {/* Title */}
                    <h3 className="text-base sm:text-[17px] font-bold text-slate-900 tracking-tight truncate">
                      {item.title}
                    </h3>

                    {/* Metadata Row: Category pill + Location + Price */}
                    <div className="flex flex-wrap items-center gap-2.5 text-xs">
                      {/* Pill category badge */}
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full border border-slate-200 bg-white font-medium text-slate-700">
                        {item.category}
                      </span>

                      {/* Location with Pin */}
                      <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.location}</span>
                      </span>

                      {/* Price */}
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {item.priceFormatted || `₹ ${item.proposedPrice.toLocaleString('en-IN')}`}
                      </span>
                    </div>

                    {/* Provider and submission time */}
                    <p className="text-xs text-slate-400 font-normal">
                      {item.provider} · {item.submittedAt}
                    </p>
                  </div>
                </div>

                {/* Right section: Action Buttons */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {isApproved ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Approved
                      </span>
                      <button
                        onClick={() => onUndo(item.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Undo"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  ) : isRejected ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <X className="w-4 h-4 text-rose-600" />
                        Rejected
                      </span>
                      <button
                        onClick={() => onUndo(item.id)}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Undo"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Approve Button matching approvals.png */}
                      <button
                        onClick={() => onApprove(item.id, item.title)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-98 transition-all shadow-xs cursor-pointer"
                      >
                        {/* Circular check icon matching screenshot */}
                        <svg
                          className="w-4 h-4 stroke-white"
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

                      {/* Reject Button matching approvals.png */}
                      <button
                        onClick={() => setSelectedItemForReject(item)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-white hover:bg-rose-50/70 border border-rose-200 active:scale-98 transition-all shadow-2xs cursor-pointer"
                      >
                        <X className="w-4 h-4 text-rose-500 stroke-[2.2]" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <p className="text-base font-semibold text-slate-700">No pending approvals found</p>
            <p className="text-xs text-slate-500 mt-1">All partner listings have been reviewed or filter matched zero items.</p>
          </div>
        )}
      </div>

      {/* Reject Confirmation Dialog */}
      {selectedItemForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Reject Listing
              </h3>
              <button
                onClick={() => setSelectedItemForReject(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-sm text-slate-600">
                Are you sure you want to reject <strong className="text-slate-900">{selectedItemForReject.title}</strong> by {selectedItemForReject.provider}?
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Reason for rejection:
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-400"
                >
                  <option value="Incomplete safety documentation">Incomplete safety documentation</option>
                  <option value="Unverified license credentials">Unverified license credentials</option>
                  <option value="Image assets low quality">Image assets low quality</option>
                  <option value="Pricing out of regulatory bounds">Pricing out of regulatory bounds</option>
                  <option value="Duplicate listing">Duplicate listing</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedItemForReject(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
