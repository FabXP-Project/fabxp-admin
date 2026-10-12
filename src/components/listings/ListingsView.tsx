'use client';

import React, { useState } from 'react';
import { Eye, Search, X } from 'lucide-react';
import { ListingItem } from '../../types/dashboard';

interface ListingsViewProps {
  listings: ListingItem[];
  searchFilter?: string;
}

export const ListingsView: React.FC<ListingsViewProps> = ({
  listings,
  searchFilter = '',
}) => {
  const [activeTab, setActiveTab] = useState<'All Listings' | 'Pending' | 'Live' | 'Draft'>('All Listings');
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);

  const filteredListings = listings.filter((item) => {
    // Tab filter
    if (activeTab === 'Pending' && item.status !== 'Pending') return false;
    if (activeTab === 'Live' && item.status !== 'Live') return false;
    if (activeTab === 'Draft' && item.status !== 'Draft') return false;

    // Search filter
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.submittedBy.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  const renderStatusBadge = (status: ListingItem['status']) => {
    switch (status) {
      case 'Live':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#16A34A] border border-[#C5EAD0]/60">
            Live
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-[#FEF7EC] text-[#D97706] border border-[#FDE68A]/60">
            Pending
          </span>
        );
      case 'Draft':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Draft
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200">
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header matching listings.png */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
          Listings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
          Manage all platform listings
        </p>
      </div>

      {/* Main Table Card matching listings.png */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        {/* Filter Tabs matching listings.png */}
        <div className="bg-[#F8FAFC] border border-slate-100/90 p-1 rounded-xl inline-flex items-center gap-1 mb-6">
          {(['All Listings', 'Pending', 'Live', 'Draft'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Listings Table */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[12px] font-semibold text-slate-400">
                <th className="pb-3.5 font-medium">Title</th>
                <th className="pb-3.5 font-medium">Category</th>
                <th className="pb-3.5 font-medium">Submitted By</th>
                <th className="pb-3.5 font-medium">Location</th>
                <th className="pb-3.5 font-medium">Price</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 font-medium">Date</th>
                <th className="pb-3.5 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90 text-sm">
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setSelectedListing(listing)}
                  >
                    {/* Title */}
                    <td className="py-4 font-bold text-slate-900 tracking-tight">
                      {listing.title}
                    </td>

                    {/* Category */}
                    <td className="py-4">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full border border-slate-200 bg-white font-medium text-slate-700 text-xs">
                        {listing.category}
                      </span>
                    </td>

                    {/* Submitted By */}
                    <td className="py-4 text-slate-600 font-medium">
                      {listing.submittedBy}
                    </td>

                    {/* Location */}
                    <td className="py-4 text-slate-500">
                      {listing.location}
                    </td>

                    {/* Price */}
                    <td className="py-4 font-bold text-slate-900 tabular-nums">
                      {listing.priceFormatted}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 whitespace-nowrap">
                      {renderStatusBadge(listing.status)}
                    </td>

                    {/* Date */}
                    <td className="py-4 text-slate-500 whitespace-nowrap text-xs sm:text-sm">
                      {listing.date}
                    </td>

                    {/* Action: Eye Icon */}
                    <td className="py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedListing(listing);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 stroke-[1.9]" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                    No listings found for this category or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900">{selectedListing.title}</span>
                {renderStatusBadge(selectedListing.status)}
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 block">Category</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedListing.category}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Submitted By</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedListing.submittedBy}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Location</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{selectedListing.location}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Price</span>
                  <span className="font-bold text-slate-900 mt-0.5 block tabular-nums">{selectedListing.priceFormatted}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Submission Date</span>
                <span className="text-sm text-slate-700 mt-0.5 block">{selectedListing.date}</span>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedListing(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0B2545] rounded-lg hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
