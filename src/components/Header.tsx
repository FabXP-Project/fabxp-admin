'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  Check,
  User,
  Settings,
  LogOut,
  ExternalLink,
  ShieldAlert,
  KeyRound,
  Smartphone,
} from 'lucide-react';

interface HeaderProps {
  onToggleMobileNav: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadNotifications?: number;
  onOpenNotifications?: () => void;
  onLogout?: () => void;
  onNavigateSettings?: () => void;
  onNavigateUsers?: () => void;
  onNavigateResetPassword?: () => void;
  onNavigate2FA?: () => void;
  onNavigate2FASetup?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileNav,
  searchQuery,
  onSearchChange,
  unreadNotifications = 3,
  onOpenNotifications,
  onLogout,
  onNavigateSettings,
  onNavigateUsers,
  onNavigateResetPassword,
  onNavigate2FA,
  onNavigate2FASetup,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Booking FBX-2841 confirmed',
      subtitle: 'Scuba Diving Goa by Rahul Sharma · ₹3,500',
      time: '12m ago',
      read: false,
    },
    {
      id: '2',
      title: 'Listing pending approval',
      subtitle: 'Sunset Kayaking Kerala submitted by WaterSports Co.',
      time: '2h ago',
      read: false,
    },
    {
      id: '3',
      title: 'Weekly Payout Cycle Ready',
      subtitle: '52 provider settlements queued for processing',
      time: '5h ago',
      read: false,
    },
  ]);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="h-[72px] bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left zone: Sidebar toggle + Search input */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {/* Toggle icon matching the screenshot */}
        <button
          onClick={onToggleMobileNav}
          className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors focus:outline-hidden"
          aria-label="Toggle navigation drawer"
          title="Toggle Navigation"
        >
          {/* Custom sidebar layout icon matching the screenshot icon exactly */}
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>

        {/* Search Bar matching screenshot */}
        <div className="relative w-full max-w-[340px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-slate-200/70 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right zone: Notification bell + User profile */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              if (onOpenNotifications) {
                onOpenNotifications();
              } else {
                setShowNotifications(!showNotifications);
              }
            }}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifications"
            title="Open Notifications"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#4F46E5] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">Notifications</span>
                  <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`px-4 py-3 hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      !item.read ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Capsule */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors focus:outline-hidden group"
          >
            {/* Avatar circle matching screenshot: dark navy `#1E293B` with SA */}
            <div className="w-9 h-9 rounded-full bg-[#1E293B] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs ring-2 ring-slate-100">
              SA
            </div>

            {/* User credentials */}
            <div className="text-left hidden md:block">
              <div className="text-sm font-semibold text-slate-900 leading-tight">Super Admin</div>
              <div className="text-xs text-slate-500 leading-tight">admin@fabxp.com</div>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors ml-0.5" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900">Super Admin</p>
                <p className="text-xs text-slate-500">Full System Privileges</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateUsers?.();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Account Profile
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onNavigateSettings?.();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Admin Preferences
                </button>
                {onNavigate2FA && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate2FA();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    Two-Factor Auth (2FA)
                  </button>
                )}
                {onNavigateResetPassword && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigateResetPassword();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-slate-400" />
                    Reset Password
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout?.();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-slate-400" />
                  Lock Admin Session
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout?.();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
