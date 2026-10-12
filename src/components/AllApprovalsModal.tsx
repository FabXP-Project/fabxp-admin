'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, MapPin, Tag } from 'lucide-react';
import { ApprovalItem } from '../types/dashboard';

interface AllApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvals: ApprovalItem[];
  approvedIds: Set<string>;
  onApprove: (id: string, title: string) => void;
  onApproveAll: () => void;
}

export const AllApprovalsModal: React.FC<AllApprovalsModalProps> = ({
  isOpen,
  onClose,
  approvals,
  approvedIds,
  onApprove,
  onApproveAll,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  if (!isOpen) return null;

  const filteredApprovals = approvals.filter((item) => {
    if (filterCategory === 'All') return true;
    return item.category === filterCategory;
  });

  const pendingRemaining = approvals.filter((item) => !approvedIds.has(item.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Partner & Listing Approvals</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {pendingRemaining} pending approval review{pendingRemaining === 1 ? '' : 's'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter categories & Batch action */}
        <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            {['All', 'Experiences', 'Stay', 'Flight', 'Insurance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#0B2545] text-white'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {pendingRemaining > 0 && (
            <button
              onClick={onApproveAll}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/80 rounded-lg transition-colors cursor-pointer"
            >
              Approve All ({pendingRemaining})
            </button>
          )}
        </div>

        {/* Approvals List */}
        <div className="p-6 overflow-y-auto divide-y divide-slate-100 space-y-3">
          {filteredApprovals.map((item) => {
            const isApproved = approvedIds.has(item.id);

            return (
              <div
                key={item.id}
                className="pt-3 first:pt-0 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{item.provider}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {item.location}
                    </span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700">
                      ₹{item.proposedPrice.toLocaleString('en-IN')}
                    </span>
                    <span>·</span>
                    <span>{item.submittedAt}</span>
                  </div>
                </div>

                {isApproved ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Approved
                  </span>
                ) : (
                  <button
                    onClick={() => onApprove(item.id, item.title)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    <span>Approve</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredApprovals.length} listings</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-700 hover:text-slate-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
