'use client';

import React, { useState } from 'react';
import { ShieldCheck, Smartphone, KeyRound, Lock, ExternalLink } from 'lucide-react';
import { PlatformSettings } from '../../types/dashboard';

interface SettingsViewProps {
  settings: PlatformSettings;
  onSaveSettings: (newSettings: PlatformSettings) => void;
  onNavigateResetPassword?: () => void;
  onNavigate2FA?: () => void;
  onNavigate2FASetup?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onNavigateResetPassword,
  onNavigate2FA,
  onNavigate2FASetup,
}) => {
  const [formData, setFormData] = useState<PlatformSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header matching settings.png */}
      <div>
        <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
          Platform configuration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: General */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 tracking-tight mb-6">
            General
          </h2>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Platform Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={formData.platformName}
                  onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* Support Email */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Support Email
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            {/* Platform URL */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Platform URL
              </label>
              <input
                type="url"
                value={formData.platformUrl}
                onChange={(e) => setFormData({ ...formData, platformUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 tracking-tight mb-6">
            Notifications
          </h2>

          <div className="divide-y divide-slate-100">
            {/* New booking alerts */}
            <div className="pb-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">New booking alerts</h4>
                <p className="text-xs text-slate-400 mt-0.5">Get notified for every new booking</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.newBookingAlerts}
                onClick={() =>
                  setFormData({ ...formData, newBookingAlerts: !formData.newBookingAlerts })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  formData.newBookingAlerts ? 'bg-[#5850EC]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formData.newBookingAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Payout reminders */}
            <div className="py-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Payout reminders</h4>
                <p className="text-xs text-slate-400 mt-0.5">Remind when payouts are pending</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.payoutReminders}
                onClick={() =>
                  setFormData({ ...formData, payoutReminders: !formData.payoutReminders })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  formData.payoutReminders ? 'bg-[#5850EC]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formData.payoutReminders ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Listing submissions */}
            <div className="pt-4 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Listing submissions</h4>
                <p className="text-xs text-slate-400 mt-0.5">Alert when new listings are submitted for review</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formData.listingSubmissions}
                onClick={() =>
                  setFormData({ ...formData, listingSubmissions: !formData.listingSubmissions })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  formData.listingSubmissions ? 'bg-[#5850EC]' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    formData.listingSubmissions ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Authentication */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Security & Authentication
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Two-factor verification and access controls for administrative personnel
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5" /> High Security Active
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {/* 2FA Row */}
            <div className="pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4 text-[#0B2545]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authenticator app (TOTP) verification required on administrator logins.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-12 sm:pl-0">
                {onNavigate2FA && (
                  <button
                    type="button"
                    onClick={onNavigate2FA}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Test Verify
                  </button>
                )}
                {onNavigate2FASetup && (
                  <button
                    type="button"
                    onClick={onNavigate2FASetup}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#153a65] text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Configure 2FA</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Password Management */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4 text-[#0B2545]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Administrator Password
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update master authentication password with enterprise complexity standards.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-12 sm:pl-0">
                {onNavigateResetPassword && (
                  <button
                    type="button"
                    onClick={onNavigateResetPassword}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset Password</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Purple/Violet Save Settings Button matching settings.png */}
        <div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#5850EC] hover:bg-[#4E44D4] active:scale-98 transition-all shadow-xs cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
