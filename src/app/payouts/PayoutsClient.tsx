'use client';

import React from 'react';
import { useAdmin } from '@/src/context/AdminContext';
import { PayoutsView } from '@/src/components/payouts/PayoutsView';
import { PayoutItem } from '@/src/types/dashboard';

interface PayoutsClientProps {
  initialPayouts: PayoutItem[];
}

export const PayoutsClient: React.FC<PayoutsClientProps> = ({ initialPayouts }) => {
  const { payouts, handleApprovePayout, searchQuery } = useAdmin();

  return (
    <PayoutsView
      payouts={payouts.length > 0 ? payouts : initialPayouts}
      onApprovePayout={handleApprovePayout}
      searchFilter={searchQuery}
    />
  );
};
