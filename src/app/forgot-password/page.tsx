'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/context/AdminContext';
import { ForgotPasswordView } from '@/src/components/auth/ForgotPasswordView';
import { AuthPreviewHeader } from '@/src/components/auth/AuthPreviewHeader';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { setAuthEmail, showToast } = useAdmin();

  return (
    <div className="min-h-screen bg-[#F8FAFC] antialiased relative">
      <AuthPreviewHeader />
      <ForgotPasswordView
        onBackToLogin={() => router.push('/login')}
        onNavigateResetPassword={() => router.push('/reset-password')}
        onProceedTo2FA={(email) => {
          setAuthEmail(email);
          showToast(`Security code sent to ${email}. Please verify with 2FA.`);
          router.push('/2fa-verify');
        }}
      />
    </div>
  );
}
