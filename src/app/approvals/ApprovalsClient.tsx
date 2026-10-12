'use client';

import React from 'react';
import { useAdmin } from '@/src/context/AdminContext';
import { ApprovalsView } from '@/src/components/approvals/ApprovalsView';
import { ApprovalItem } from '@/src/types/dashboard';

interface ApprovalsClientProps {
  initialApprovals: ApprovalItem[];
}

export const ApprovalsClient: React.FC<ApprovalsClientProps> = ({ initialApprovals }) => {
  const {
    approvals,
    approvedIds,
    rejectedIds,
    handleApprove,
    handleReject,
    handleUndo,
    searchQuery,
  } = useAdmin();

  return (
    <ApprovalsView
      approvals={approvals.length > 0 ? approvals : initialApprovals}
      approvedIds={approvedIds}
      rejectedIds={rejectedIds}
      onApprove={handleApprove}
      onReject={handleReject}
      onUndo={handleUndo}
      searchFilter={searchQuery}
    />
  );
};
