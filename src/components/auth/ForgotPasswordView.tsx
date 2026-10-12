'use client';

import React, { useState } from 'react';
import { Logo } from '../Sidebar';
import { CheckCircle2, X, HelpCircle, ShieldCheck } from 'lucide-react';

interface ForgotPasswordViewProps {
  onBackToLogin: () => void;
  onNavigateResetPassword?: () => void;
  onProceedTo2FA?: (email: string) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onBackToLogin,
  onNavigateResetPassword,
  onProceedTo2FA,
}) => {
  const [email, setEmail] = useState('admin@fabxp.com');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onProceedTo2FA) {
        onProceedTo2FA(email);
      } else {
        setIsSubmitted(true);
      }
    }, 400);
  };

  const handleManualProceed2FA = () => {
    if (onProceedTo2FA) {
      onProceedTo2FA(email);
    } else if (onNavigateResetPassword) {
      onNavigateResetPassword();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 antialiased text-slate-800 relative">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Brand Logo centered matching forgot password design */}
        <div className="mb-6 flex justify-center">
          <Logo className="items-center text-center" />
        </div>

        {/* Header Title & Subtitle */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold mb-2">
            <span>Step 1 of 3</span>
            <span>·</span>
            <span>Account Recovery</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
            Forgot password?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Enter your email to verify your identity and reset your password
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs">
          {isSubmitted ? (
            <div className="text-center py-2 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-[#0B2545] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Two-Factor Security Required</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  To protect administrator access for <strong className="text-slate-700">{email}</strong>, you must verify your identity with 2FA before setting a new password.
                </p>
              </div>
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleManualProceed2FA}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-99 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify with 2FA to Continue</span>
                </button>
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
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

              {/* Submit Button matching forgot design with 2FA flow */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-99 transition-all cursor-pointer shadow-xs disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Send Code & Verify with 2FA</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1.5">
                  <span>Requires 2FA verification to reset admin password</span>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Back to login and direct reset link below card */}
        <div className="mt-4 text-center flex items-center justify-center gap-3 text-xs">
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Back to login
          </button>
          {onNavigateResetPassword && (
            <>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={onNavigateResetPassword}
                className="font-medium text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer"
              >
                Reset password page
              </button>
            </>
          )}
        </div>

        {/* Footer info matching screenshot */}
        <div className="mt-6 text-center text-xs text-slate-400">
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
                <span>Admin Password Recovery</span>
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
                Reset instructions are dispatched to registered corporate emails only. If you encounter issues receiving the email, reach out to:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-mono text-slate-800 text-[11px]">
                operations@fabxp.com
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Administrator single sign-on enabled</span>
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
