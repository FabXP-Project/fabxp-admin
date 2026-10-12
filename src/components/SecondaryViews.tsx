'use client';

import React from 'react';
import { Users, List, CalendarCheck, ShieldCheck, Percent, Wallet, BarChart2, Settings } from 'lucide-react';

interface SecondaryViewProps {
  tab: string;
  onBackToDashboard: () => void;
}

export const SecondaryView: React.FC<SecondaryViewProps> = ({ tab, onBackToDashboard }) => {
  const getViewDetails = () => {
    switch (tab) {
      case 'users':
        return {
          title: 'User Management',
          desc: 'Manage customer accounts, roles, verified badges, and login permissions.',
          icon: Users,
          count: '1,420 registered travelers',
        };
      case 'listings':
        return {
          title: 'Listings Directory',
          desc: 'Curated experiences, stay accommodations, flight transfers, and insurance packages.',
          icon: List,
          count: '248 live listings',
        };
      case 'bookings':
        return {
          title: 'All Bookings',
          desc: 'Comprehensive ledger of historical and upcoming reservation orders.',
          icon: CalendarCheck,
          count: '3,892 total bookings',
        };
      case 'approvals':
        return {
          title: 'Approvals Queue',
          desc: 'Verify provider documentation, safety compliance, and listing details.',
          icon: ShieldCheck,
          count: '14 awaiting sign-off',
        };
      case 'commission':
        return {
          title: 'Commission Rules & Tiers',
          desc: 'Define take rates, seasonal multipliers, and partner tier percentages.',
          icon: Percent,
          count: 'Standard rate: 12% - 15%',
        };
      case 'payouts':
        return {
          title: 'Payout Settlements',
          desc: 'Weekly automated disbursement batches to vendor bank accounts.',
          icon: Wallet,
          count: '₹14,80,000 processed this month',
        };
      case 'analytics':
        return {
          title: 'Deep Analytics & Insights',
          desc: 'Cohort analysis, repeat customer velocity, and regional revenue maps.',
          icon: BarChart2,
          count: '+24% YoY growth',
        };
      case 'settings':
        return {
          title: 'Platform Settings',
          desc: 'API keys, currency conversions, notification preferences, and team permissions.',
          icon: Settings,
          count: 'Environment: Production',
        };
      default:
        return {
          title: 'Section',
          desc: 'Section details.',
          icon: List,
          count: '',
        };
    }
  };

  const details = getViewDetails();
  const Icon = details.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
            <Icon className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{details.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{details.desc}</p>
          </div>
        </div>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 text-xs font-semibold text-[#0B2545] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          ← Return to Dashboard
        </button>
      </div>

      <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
        <p className="text-sm font-semibold text-slate-700">{details.count}</p>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Viewing {details.title.toLowerCase()} module. Click above to return to the main dashboard view.
        </p>
      </div>
    </div>
  );
};
