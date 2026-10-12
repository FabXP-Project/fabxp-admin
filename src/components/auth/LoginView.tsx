'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, X, HelpCircle, ShieldCheck } from 'lucide-react';
import { Logo } from '../Sidebar';

interface LoginViewProps {
  onLogin: (email: string) => void;
  onNavigateForgotPassword: () => void;
  onNavigateResetPassword?: () => void;
  onNavigate2FA?: () => void;
  onNavigate2FASetup?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onNavigateForgotPassword,
  onNavigateResetPassword,
  onNavigate2FA,
  onNavigate2FASetup,
}) => {
  const [email, setEmail] = useState('admin@fabxp.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [require2FA, setRequire2FA] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (require2FA && onNavigate2FA) {
        onNavigate2FA();
      } else {
        onLogin(email || 'admin@fabxp.com');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 antialiased text-slate-800 relative">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Brand Logo centered matching login admin design */}
        <div className="mb-6 flex justify-center">
          <Logo className="items-center text-center" />
        </div>

        {/* Header Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Sign in to your Fabxp account
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-indigo-100 transition-all tracking-wider font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.8]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.8]" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545]"
                />
                <span className="text-xs font-medium text-slate-600">Remember me</span>
              </label>

              <button
                type="button"
                onClick={onNavigateForgotPassword}
                className="text-xs font-medium text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* 2FA Option */}
            {onNavigate2FA && (
              <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={require2FA}
                    onChange={(e) => setRequire2FA(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545]"
                  />
                  <span>Verify with 2FA code</span>
                </label>
                <button
                  type="button"
                  onClick={onNavigate2FA}
                  className="text-xs font-medium text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Enter 2FA code →
                </button>
              </div>
            )}

            {/* Submit Button matching login admin design */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-99 transition-all cursor-pointer shadow-xs disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{require2FA ? 'Continue with 2FA' : 'Sign In'}</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick design navigators */}
        <div className="mt-5 text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
          {onNavigateResetPassword && (
            <button
              type="button"
              onClick={onNavigateResetPassword}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Reset Password
            </button>
          )}
          {onNavigate2FA && (
            <>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={onNavigate2FA}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                2FA Verification
              </button>
            </>
          )}
          {onNavigate2FASetup && (
            <>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={onNavigate2FASetup}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                2FA Setup
              </button>
            </>
          )}
        </div>

        {/* Footer info matching screenshot */}
        <div className="mt-5 text-center text-xs text-slate-400">
          <span>Protected by Fabxp · </span>
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="text-slate-500 hover:text-slate-700 underline transition-colors cursor-pointer"
          >
            Need help?
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-[#0B2545]" />
                <span>Admin Portal Support</span>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-2.5">
              <p>
                To obtain administrator credentials, request permission adjustments, or reset credentials, please contact the FabXP Operations team:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-mono text-slate-800 text-[11px]">
                operations@fabxp.com
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Default sandbox access: admin@fabxp.com</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 px-4 bg-[#0B2545] text-white rounded-xl text-xs font-semibold hover:bg-[#153a65]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
