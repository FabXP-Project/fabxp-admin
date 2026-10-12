'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  List,
  CalendarCheck,
  CheckCircle2,
  Percent,
  Wallet,
  BarChart2,
  Settings,
  X,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingCount?: number;
  onLogout?: () => void;
}

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'add-provider', label: 'Add Provider', icon: UserPlus },
  { id: 'listings', label: 'Listings', icon: List },
  { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { id: 'approvals', label: 'Approvals', icon: CheckCircle2, badgeKey: true },
  { id: 'commission', label: 'Commission', icon: Percent },
  { id: 'payouts', label: 'Payouts', icon: Wallet },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col select-none ${className}`}>
      <div className="flex items-baseline tracking-tight">
        <span className="text-[26px] font-extrabold text-[#0B2545] tracking-tight leading-none">
          fab
        </span>
        <span className="text-[26px] font-extrabold text-[#16A34A] tracking-tight leading-none ml-[0.5px]">
          xp
        </span>
      </div>
      <span className="text-[9.5px] font-medium tracking-wide text-slate-400 mt-1 leading-none">
        Live Your Experience
      </span>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  pendingCount = 14,
  onLogout,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="h-[80px] px-6 flex items-center justify-between border-b border-slate-100/80">
          <Logo />
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#F2EDFD] text-[#4F46E5] font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-[19px] h-[19px] stroke-[1.9] transition-colors ${
                      isActive ? 'text-[#4F46E5]' : 'text-slate-500 group-hover:text-slate-800'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badgeKey && pendingCount > 0 && !isActive && (
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom subtle profile shortcut or version */}
        <div className="p-3 border-t border-slate-100/90 text-xs text-slate-400 flex flex-col gap-2">
          {onLogout && (
            <button
              onClick={() => {
                onCloseMobile();
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 transition-colors text-xs font-medium cursor-pointer"
              title="Lock Admin Session / Switch to Login"
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
              <span>Lock / Sign Out</span>
            </button>
          )}
          <div className="flex items-center justify-between px-1">
            <span className="font-medium text-slate-500">FabXP v2.4</span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Operational
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
