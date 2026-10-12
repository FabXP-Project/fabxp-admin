'use client';

import React from 'react';
import { useAdmin } from '@/src/context/AdminContext';
import { CommissionView } from '@/src/components/commission/CommissionView';
import { CommissionDefaults, CustomCommissionOverride } from '@/src/types/dashboard';

interface CommissionClientProps {
  initialDefaults: CommissionDefaults;
  initialOverrides: CustomCommissionOverride[];
}

export const CommissionClient: React.FC<CommissionClientProps> = ({
  initialDefaults,
  initialOverrides,
}) => {
  const {
    commissionDefaults,
    customOverrides,
    handleSaveDefaults,
    handleUpdateOverride,
    handleAddOverride,
  } = useAdmin();

  return (
    <CommissionView
      defaults={commissionDefaults || initialDefaults}
      customOverrides={customOverrides.length > 0 ? customOverrides : initialOverrides}
      onSaveDefaults={handleSaveDefaults}
      onUpdateOverride={handleUpdateOverride}
      onAddOverride={handleAddOverride}
    />
  );
};
