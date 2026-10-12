'use client';

import React, { useState, useRef } from 'react';
import {
  Copy,
  Check,
  ShieldCheck,
  QrCode,
  Smartphone,
  Download,
  HelpCircle,
  X,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { Logo } from '../Sidebar';

interface TwoFactorSetupViewProps {
  onSetupSuccess: () => void;
  onBackToLogin: () => void;
  onNavigateVerify?: () => void;
}

export const TwoFactorSetupView: React.FC<TwoFactorSetupViewProps> = ({
  onSetupSuccess,
  onBackToLogin,
  onNavigateVerify,
}) => {
  const secretKey = 'FABX 8K9P 2MQ4 7TZW';
  const backupCodes = [
    'A9F2-41BC',
    '7C3D-E29A',
    '81KL-90MN',
    '54OP-32QR',
    '67ST-88UV',
    '12WX-34YZ',
    '45AB-67CD',
    '89EF-01GH',
  ];

  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedBackupCodes, setCopiedBackupCodes] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showBackupCodesModal, setShowBackupCodesModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(secretKey.replace(/\s+/g, ''));
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard?.writeText(backupCodes.join('\n'));
    setCopiedBackupCodes(true);
    setTimeout(() => setCopiedBackupCodes(false), 2000);
  };

  const handleDownloadBackupCodes = () => {
    const text = `FabXP Administrator Backup Recovery Codes\nAccount: admin@fabxp.com\nDate: ${new Date().toLocaleDateString()}\n\n` + backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fabxp-backup-recovery-codes.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    if (cleaned.length > 1) {
      const numericOnly = cleaned.slice(0, 6);
      const nextDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        nextDigits[i] = numericOnly[i] || '';
      }
      setDigits(nextDigits);
      setErrorMessage('');
      const targetFocus = Math.min(numericOnly.length, 5);
      inputRefs.current[targetFocus]?.focus();
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned[0];
    setDigits(nextDigits);
    setErrorMessage('');

    if (index < 5 && cleaned) {
      inputRefs.current[index + 1]?.focus();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the 6-digit code from your authenticator app');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 antialiased text-slate-800 relative py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Brand Logo centered matching auth designs */}
        <div className="mb-6 flex justify-center">
          <Logo className="items-center text-center" />
        </div>

        {/* Header Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
            Set up two-factor authentication
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Scan the QR code with your authenticator app to enable 2FA
          </p>
        </div>

        {/* Card Container */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
          {isSuccess ? (
            <div className="text-center py-2 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-13 h-13 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Two-factor authentication enabled</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Your administrator account is now protected with 2FA. Save your emergency backup recovery codes in a safe place.
                </p>
              </div>

              {/* Backup codes box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-600" /> Backup Recovery Codes
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyBackupCodes}
                    className="text-[11px] font-semibold text-[#0B2545] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedBackupCodes ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy all
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/50">
                  {backupCodes.map((code, idx) => (
                    <span key={idx} className="tracking-wider">
                      {code}
                    </span>
                  ))}
                </div>
                <div className="mt-2.5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleDownloadBackupCodes}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Download TXT
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={onSetupSuccess}
                  className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#0B2545] hover:bg-[#153a65] active:scale-99 transition-all cursor-pointer shadow-xs"
                >
                  Continue to dashboard
                </button>
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Return to sign in
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/60 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Scan QR Code */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded-full bg-[#0B2545] text-white text-[11px] font-bold flex items-center justify-center">
                    1
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Scan QR code with your authenticator
                  </span>
                </div>

                {/* QR Code Container styled with high fidelity */}
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="p-3.5 bg-white rounded-xl shadow-xs border border-slate-200/70 relative">
                    {/* SVG QR Code representation */}
                    <svg
                      className="w-40 h-40"
                      viewBox="0 0 160 160"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* White background */}
                      <rect width="160" height="160" fill="white" />

                      {/* Top-Left Finder Pattern */}
                      <rect x="8" y="8" width="44" height="44" rx="4" fill="#0B2545" />
                      <rect x="15" y="15" width="30" height="30" rx="2" fill="white" />
                      <rect x="22" y="22" width="16" height="16" rx="2" fill="#0B2545" />

                      {/* Top-Right Finder Pattern */}
                      <rect x="108" y="8" width="44" height="44" rx="4" fill="#0B2545" />
                      <rect x="115" y="15" width="30" height="30" rx="2" fill="white" />
                      <rect x="122" y="22" width="16" height="16" rx="2" fill="#0B2545" />

                      {/* Bottom-Left Finder Pattern */}
                      <rect x="8" y="108" width="44" height="44" rx="4" fill="#0B2545" />
                      <rect x="15" y="115" width="30" height="30" rx="2" fill="white" />
                      <rect x="22" y="122" width="16" height="16" rx="2" fill="#0B2545" />

                      {/* Timing Patterns */}
                      <g fill="#0B2545">
                        <rect x="58" y="26" width="6" height="6" rx="1" />
                        <rect x="70" y="26" width="6" height="6" rx="1" />
                        <rect x="82" y="26" width="6" height="6" rx="1" />
                        <rect x="94" y="26" width="6" height="6" rx="1" />

                        <rect x="26" y="58" width="6" height="6" rx="1" />
                        <rect x="26" y="70" width="6" height="6" rx="1" />
                        <rect x="26" y="82" width="6" height="6" rx="1" />
                        <rect x="26" y="94" width="6" height="6" rx="1" />

                        {/* Data Modules */}
                        <rect x="58" y="40" width="6" height="6" rx="1" />
                        <rect x="70" y="40" width="6" height="6" rx="1" />
                        <rect x="82" y="40" width="6" height="6" rx="1" />
                        <rect x="94" y="52" width="6" height="6" rx="1" />
                        <rect x="58" y="64" width="6" height="6" rx="1" />
                        <rect x="70" y="64" width="6" height="6" rx="1" />
                        <rect x="82" y="76" width="6" height="6" rx="1" />
                        <rect x="94" y="88" width="6" height="6" rx="1" />
                        <rect x="108" y="58" width="6" height="6" rx="1" />
                        <rect x="120" y="58" width="6" height="6" rx="1" />
                        <rect x="132" y="70" width="6" height="6" rx="1" />
                        <rect x="144" y="82" width="6" height="6" rx="1" />
                        <rect x="108" y="94" width="6" height="6" rx="1" />
                        <rect x="120" y="94" width="6" height="6" rx="1" />
                        <rect x="132" y="106" width="6" height="6" rx="1" />
                        <rect x="144" y="118" width="6" height="6" rx="1" />
                        <rect x="108" y="130" width="6" height="6" rx="1" />
                        <rect x="120" y="142" width="6" height="6" rx="1" />
                        <rect x="58" y="108" width="6" height="6" rx="1" />
                        <rect x="70" y="108" width="6" height="6" rx="1" />
                        <rect x="82" y="120" width="6" height="6" rx="1" />
                        <rect x="94" y="132" width="6" height="6" rx="1" />
                        <rect x="58" y="144" width="6" height="6" rx="1" />
                        <rect x="70" y="132" width="6" height="6" rx="1" />
                        <rect x="82" y="144" width="6" height="6" rx="1" />
                        <rect x="40" y="64" width="6" height="6" rx="1" />
                        <rect x="10" y="76" width="6" height="6" rx="1" />
                        <rect x="22" y="88" width="6" height="6" rx="1" />
                        <rect x="34" y="100" width="6" height="6" rx="1" />
                        <rect x="46" y="112" width="6" height="6" rx="1" />
                        <rect x="100" y="10" width="6" height="6" rx="1" />
                        <rect x="70" y="10" width="6" height="6" rx="1" />
                      </g>

                      {/* Central Badge */}
                      <rect x="66" y="66" width="28" height="28" rx="6" fill="#0B2545" />
                      <circle cx="80" cy="80" r="8" fill="#10B981" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2 font-medium">
                    Google Authenticator, Microsoft Authenticator, Authy, or 1Password
                  </span>
                </div>

                {/* Manual Entry Setup Key */}
                <div className="mt-3">
                  <div className="text-[11px] text-slate-500 font-medium mb-1">
                    Or enter setup key manually:
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="text-xs font-mono font-semibold text-slate-800 tracking-wider">
                      {secretKey}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:text-[#0B2545] hover:border-slate-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      {copiedKey ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2: Verification Code Input */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#0B2545] text-white text-[11px] font-bold flex items-center justify-center">
                    2
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Enter the 6-digit code shown in the app
                  </span>
                </div>

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
                      className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg sm:text-xl font-bold font-mono text-slate-900 bg-[#F8FAFC] border border-slate-200/90 rounded-xl focus:outline-hidden focus:bg-white focus:border-[#0B2545] focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  ))}
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
                    <span>Verify & enable 2FA</span>
                  )}
                </button>
              </div>

              {/* Auxiliary navigation */}
              <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                {onNavigateVerify && (
                  <button
                    type="button"
                    onClick={onNavigateVerify}
                    className="hover:text-slate-800 font-medium transition-colors cursor-pointer"
                  >
                    Already set up? Enter code
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowBackupCodesModal(true)}
                  className="hover:text-slate-800 font-medium transition-colors cursor-pointer text-right ml-auto"
                >
                  View backup codes
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

      {/* Backup codes preview modal */}
      {showBackupCodesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Emergency Backup Codes</span>
              </div>
              <button
                onClick={() => setShowBackupCodesModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 text-xs text-slate-600 space-y-3">
              <p>
                Each backup code can only be used once. Store these securely in case you lose access to your primary authenticator device.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                {backupCodes.map((code, idx) => (
                  <span key={idx} className="tracking-wider text-center">
                    {code}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyBackupCodes}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedBackupCodes ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBackupCodes ? 'Copied!' : 'Copy codes'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBackupCodes}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowBackupCodesModal(false)}
              className="w-full py-2.5 px-4 bg-[#0B2545] text-white rounded-xl text-xs font-semibold hover:bg-[#153a65]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-[#0B2545]" />
                <span>2FA Setup Guide</span>
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
                <strong>Recommended apps:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
                <li>Google Authenticator (iOS & Android)</li>
                <li>Microsoft Authenticator (iOS & Android)</li>
                <li>Authy or 1Password</li>
              </ul>
              <p className="pt-1">
                Open your app, tap <em>Add Account (+)</em>, and point your camera at the QR code. Then type the 6-digit confirmation code.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-600 font-medium pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Demo sandbox: any 6 digits work</span>
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
