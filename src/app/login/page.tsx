'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/context/AdminContext';
import { LoginView } from '@/src/components/auth/LoginView';
import { AuthPreviewHeader } from '@/src/components/auth/AuthPreviewHeader';

export default function LoginPage() {
  const router = useRouter();
  const { handleLogin } = useAdmin();

  return (
    <div className="min-h-screen bg-[#F8FAFC] antialiased relative">
      <AuthPreviewHeader />
      <LoginView
        onLogin={handleLogin}
        onNavigateForgotPassword={() => router.push('/forgot-password')}
        onNavigateResetPassword={() => router.push('/reset-password')}
        onNavigate2FA={() => router.push('/2fa-verify')}
        onNavigate2FASetup={() => router.push('/2fa-setup')}
      />
    </div>
  );
}
