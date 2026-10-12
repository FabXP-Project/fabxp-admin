'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/context/AdminContext';
import { SettingsView } from '@/src/components/settings/SettingsView';
import { PlatformSettings } from '@/src/types/dashboard';

interface SettingsClientProps {
  initialSettings: PlatformSettings;
}

export const SettingsClient: React.FC<SettingsClientProps> = ({ initialSettings }) => {
  const router = useRouter();
  const { settings, handleSaveSettings } = useAdmin();

  return (
    <SettingsView
      settings={settings || initialSettings}
      onSaveSettings={handleSaveSettings}
      onNavigateResetPassword={() => router.push('/reset-password')}
      onNavigate2FA={() => router.push('/2fa-verify')}
      onNavigate2FASetup={() => router.push('/2fa-setup')}
    />
  );
};
