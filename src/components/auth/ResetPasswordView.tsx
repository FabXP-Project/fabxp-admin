'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, X, HelpCircle, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { Logo } from '../Sidebar';

interface ResetPasswordViewProps {
  onBackToLogin: () => void;
  onPasswordResetSuccess?: () => void;
  userEmail?: string;
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({
  onBackToLogin,
  onPasswordResetSuccess,
  userEmail = 'admin@fabxp.com',
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Strength calculation: 0 to 4
  const strengthScore = [hasMinLength, hasNumber, hasUppercase, hasSpecial].filter(Boolean).length;

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { label: 'Empty', color: 'bg-slate-200', text: 'text-slate-400' };
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (strengthScore <= 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      onPasswordResetSuccess?.();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 antialiased text-slate-800 relative">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Brand Logo centered matching auth designs */}
        <div className="mb-6 flex justify-center">
          <Logo className="items-center text-center" />
        </div>

        {/* Header Title & Subtitle */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-semibold mb-2">
            <span>Step 3 of 3</span>
            <span>·</span>
            <span>Identity Verified</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
            Reset password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Enter your new secure password for {userEmail}
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs">
          {isSuccess ? (
            <div className="text-center py-2 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Password reset successful</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Your administrator password has been updated. You can now use your new credentials to sign in.
                </p>
              </div>
              <button
                type="button"
                onClick={onBackToLogin}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-99 transition-all cursor-pointer shadow-xs"
              >
                Sign in with new password
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/60 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-xs tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <Eye className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>

                {/* Password strength progress bar */}
                {newPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Password strength:</span>
                      <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      <div className={`rounded-full ${strengthScore >= 1 ? strength.color : 'bg-slate-100'}`} />
                      <div className={`rounded-full ${strengthScore >= 2 ? strength.color : 'bg-slate-100'}`} />
                      <div className={`rounded-full ${strengthScore >= 3 ? strength.color : 'bg-slate-100'}`} />
                      <div className={`rounded-full ${strengthScore >= 4 ? strength.color : 'bg-slate-100'}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-xs tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <Eye className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                    {passwordsMatch ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-500 font-medium">Passwords do not match</span>
                    )}
                  </div>
                )}
              </div>

              {/* Password Requirements Checklist */}
              <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                <div className="font-semibold text-slate-700 mb-1">Must contain:</div>
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 font-medium' : ''}`}>
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasMinLength ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 font-medium' : ''}`}>
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasNumber ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                  <span>At least one number</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-600 font-medium' : ''}`}>
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasUppercase ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                  <span>At least one uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-600 font-medium' : ''}`}>
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${hasSpecial ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                  <span>At least one special character</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-99 transition-all cursor-pointer shadow-xs disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Reset password</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back to login */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Back to login
          </button>
        </div>

        {/* Footer info */}
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
                <span>Admin Password Reset Support</span>
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
                If your temporary link expired or you cannot set a new password, contact the security team:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-mono text-slate-800 text-[11px]">
                security@fabxp.com
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise password policies enforced</span>
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
