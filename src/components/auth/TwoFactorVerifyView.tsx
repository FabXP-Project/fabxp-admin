'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Smartphone, KeyRound, AlertCircle, HelpCircle, X, ArrowLeft, RefreshCw } from 'lucide-react';
import { Logo } from '../Sidebar';

interface TwoFactorVerifyViewProps {
  onVerifySuccess: (code: string) => void;
  onBackToLogin: () => void;
  onNavigateSetup?: () => void;
  onBackToForgotPassword?: () => void;
  flowReason?: 'login' | 'forgot-password' | 'standalone' | 'setup';
  userEmail?: string;
}

export const TwoFactorVerifyView: React.FC<TwoFactorVerifyViewProps> = ({
  onVerifySuccess,
  onBackToLogin,
  onNavigateSetup,
  onBackToForgotPassword,
  flowReason = 'standalone',
  userEmail = 'admin@fabxp.com',
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [trustDevice, setTrustDevice] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(45);
  const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(false);
  const [recoveryCode, setRecoveryCode] = useState<string>('');
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resending
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus first input box on load
  useEffect(() => {
    if (!isRecoveryMode && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isRecoveryMode]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    // If multiple digits pasted in one field
    if (cleaned.length > 1) {
      handlePasteString(cleaned);
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned[0];
    setDigits(nextDigits);
    setErrorMessage('');

    // Advance to next input
    if (index < 5 && cleaned) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits entered, auto-verify if desired
    if (index === 5 && nextDigits.every((d) => d.length === 1)) {
      triggerVerify(nextDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    handlePasteString(pasted);
  };

  const handlePasteString = (str: string) => {
    const numericOnly = str.replace(/\D/g, '').slice(0, 6);
    if (!numericOnly) return;
    const nextDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = numericOnly[i] || '';
    }
    setDigits(nextDigits);
    setErrorMessage('');

    const targetFocus = Math.min(numericOnly.length, 5);
    inputRefs.current[targetFocus]?.focus();

    if (numericOnly.length === 6) {
      triggerVerify(numericOnly);
    }
  };

  const triggerVerify = (code: string) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      onVerifySuccess(code);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecoveryMode) {
      if (!recoveryCode.trim() || recoveryCode.trim().length < 8) {
        setErrorMessage('Please enter a valid 8-character emergency backup code');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onVerifySuccess(recoveryCode);
      }, 450);
      return;
    }

    const fullCode = digits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code');
      return;
    }

    triggerVerify(fullCode);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(45);
    setDigits(['', '', '', '', '', '']);
    setErrorMessage('');
    inputRefs.current[0]?.focus();
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
          {flowReason === 'forgot-password' ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-[11px] font-semibold mb-2">
              <span>Step 2 of 3</span>
              <span>·</span>
              <span>Identity Verification</span>
            </div>
          ) : flowReason === 'login' ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold mb-2">
              <span>Step 2 of 2</span>
              <span>·</span>
              <span>Sign In Security</span>
            </div>
          ) : null}
          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
            Two-factor authentication
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-sm mx-auto">
            {isRecoveryMode
              ? 'Enter an emergency backup recovery code'
              : flowReason === 'forgot-password'
              ? `Verify your identity with your 6-digit authenticator code to reset password for ${userEmail}`
              : flowReason === 'login'
              ? `Enter the 6-digit code from your authenticator app to complete sign in for ${userEmail}`
              : 'Enter the 6-digit code from your authenticator app'}
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs">
          {/* Method Indicator Badge */}
          <div className="mb-5 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-700">
              {isRecoveryMode ? (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>Backup Recovery Code</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-[#0B2545]" />
                  <span>Authenticator App (TOTP)</span>
                </>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/60 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {isRecoveryMode ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Emergency Recovery Code
                </label>
                <input
                  type="text"
                  required
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                  placeholder="ABCD-EFGH-1234"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm font-mono tracking-wider text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-indigo-100 transition-all text-center"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 text-center">
                  Case-insensitive. Single-use backup code generated during 2FA setup.
                </p>
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2 text-center">
                  Verification Code
                </label>
                {/* 6 Individual Code Inputs */}
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {digits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg sm:text-xl font-bold font-mono text-slate-900 bg-[#F8FAFC] border border-slate-200/90 rounded-xl focus:outline-hidden focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Remember / Trust device */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={trustDevice}
                  onChange={(e) => setTrustDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545]"
                />
                <span className="font-medium text-slate-600">Trust this device for 30 days</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-99 transition-all cursor-pointer shadow-xs disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>
                    {flowReason === 'forgot-password'
                      ? 'Verify & Proceed to Reset Password'
                      : flowReason === 'login'
                      ? 'Verify code & sign in'
                      : 'Verify code'}
                  </span>
                )}
              </button>
            </div>

            {/* Alternative options */}
            <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2.5 text-xs">
              {!isRecoveryMode ? (
                <>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span>Didn't receive a prompt?</span>
                    {resendCooldown > 0 ? (
                      <span className="text-slate-400 font-medium">
                        Resend in {resendCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        className="text-[#2563EB] hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Resend
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryMode(true);
                      setErrorMessage('');
                    }}
                    className="text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
                  >
                    Use emergency recovery code
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(false);
                    setErrorMessage('');
                  }}
                  className="text-[#2563EB] hover:text-blue-700 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Authenticator App code
                </button>
              )}

              {onNavigateSetup && (
                <button
                  type="button"
                  onClick={onNavigateSetup}
                  className="text-slate-500 hover:text-slate-800 text-[11px] underline transition-colors cursor-pointer pt-1"
                >
                  Need to set up or change authenticator app?
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Back navigation */}
        <div className="mt-4 text-center flex items-center justify-center gap-3 text-xs">
          {flowReason === 'forgot-password' && onBackToForgotPassword && (
            <>
              <button
                type="button"
                onClick={onBackToForgotPassword}
                className="font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back to email
              </button>
              <span className="text-slate-300">·</span>
            </>
          )}
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Return to Sign In
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
                <span>Two-Factor Authentication Help</span>
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
                Two-factor authentication adds an extra layer of security to your FabXP administrative account.
              </p>
              <p>
                Open Google Authenticator, Authy, Microsoft Authenticator, or 1Password to find your 6-digit code for <strong>FabXP (admin@fabxp.com)</strong>.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 font-mono text-slate-800 text-[11px]">
                Support: security@fabxp.com
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Demo code bypass: enter any 6 digits (e.g. 123456)</span>
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
