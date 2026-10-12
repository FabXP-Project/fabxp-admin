'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/context/AdminContext';
import { AddProviderView } from '@/src/components/providers/AddProviderView';

export const AddProviderClient: React.FC = () => {
  const router = useRouter();
  const { handleAddUser, showToast } = useAdmin();

  return (
    <AddProviderView
      onAddProvider={(provider) => {
        handleAddUser(provider);
        showToast(`Provider "${provider.name}" registered and invitation sent!`);
      }}
      onNavigateToUsers={() => router.push('/users')}
      onBackToDashboard={() => router.push('/')}
    />
  );
};
