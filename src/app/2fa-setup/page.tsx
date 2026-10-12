'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/context/AdminContext';
import { TwoFactorSetupView } from '@/src/components/auth/TwoFactorSetupView';
import { AuthPreviewHeader } from '@/src/components/auth/AuthPreviewHeader';

export default function TwoFactorSetupPage() {
  const router = useRouter();
  const { showToast, setIsAuthenticated } = useAdmin();

  const handleSuccess = () => {
    setIsAuthenticated(true);
    showToast('Two-factor authentication successfully enabled!');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] antialiased relative">
      <AuthPreviewHeader />
      <TwoFactorSetupView
        onSetupSuccess={handleSuccess}
        onBackToLogin={() => router.push('/login')}
        onNavigateVerify={() => router.push('/2fa-verify')}
      />
    </div>
  );
}
