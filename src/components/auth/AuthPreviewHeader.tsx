'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const AuthPreviewHeader: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/login', label: 'Login' },
    { href: '/forgot-password', label: 'Forgot Password' },
    { href: '/2fa-verify', label: '2FA Verify' },
    { href: '/reset-password', label: 'Reset Password' },
    { href: '/2fa-setup', label: '2FA Setup' },
  ];

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-200/90 shadow-md flex items-center gap-1 text-[11px] font-semibold text-slate-600">
      <span className="hidden sm:inline-block px-1.5 text-slate-400 font-medium">Auth Preview:</span>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
              isActive
                ? 'bg-[#0B2545] text-white shadow-xs'
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <span className="h-3 w-px bg-slate-200 mx-0.5" />
      <Link
        href="/"
        className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold transition-colors cursor-pointer"
        title="Jump directly to Dashboard view"
      >
        Dashboard →
      </Link>
    </div>
  );
};
