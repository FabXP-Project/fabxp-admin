'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/context/AdminContext';
import { TwoFactorVerifyView } from '@/src/components/auth/TwoFactorVerifyView';
import { AuthPreviewHeader } from '@/src/components/auth/AuthPreviewHeader';

export default function TwoFactorVerifyPage() {
  const router = useRouter();
  const { authEmail, showToast, setIsAuthenticated } = useAdmin();

  const handleSuccess = (code: string) => {
    setIsAuthenticated(true);
    showToast(`Identity verified with 2FA code: ${code}. Welcome back!`);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] antialiased relative">
      <AuthPreviewHeader />
      <TwoFactorVerifyView
        flowReason="login"
        userEmail={authEmail}
        onVerifySuccess={handleSuccess}
        onBackToLogin={() => router.push('/login')}
        onBackToForgotPassword={() => router.push('/forgot-password')}
        onNavigateSetup={() => router.push('/2fa-setup')}
      />
    </div>
  );
}
