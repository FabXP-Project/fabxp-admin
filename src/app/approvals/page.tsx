// Server Component for Approvals
import { getApprovals } from '@/src/lib/api/approvals';
import { ApprovalsClient } from './ApprovalsClient';

export const metadata = {
  title: 'Approvals | FabXP Admin',
  description: 'Review and approve pending partner listings on FabXP.',
};

export default async function ApprovalsPage() {
  const data = await getApprovals();
  return <ApprovalsClient initialApprovals={data.approvals} />;
}
