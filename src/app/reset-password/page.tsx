'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/context/AdminContext';
import { ResetPasswordView } from '@/src/components/auth/ResetPasswordView';
import { AuthPreviewHeader } from '@/src/components/auth/AuthPreviewHeader';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { authEmail, showToast } = useAdmin();

  const handleSuccess = () => {
    showToast('Administrator password updated successfully. Please sign in.');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] antialiased relative">
      <AuthPreviewHeader />
      <ResetPasswordView
        userEmail={authEmail}
        onBackToLogin={() => router.push('/login')}
        onPasswordResetSuccess={handleSuccess}
      />
    </div>
  );
}
