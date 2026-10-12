// Server Component for Commission
import { getCommissionData } from '@/src/lib/api/commission';
import { CommissionClient } from './CommissionClient';

export const metadata = {
  title: 'Commission | FabXP Admin',
  description: 'Manage platform take rates and partner commission tiers on FabXP.',
};

export default async function CommissionPage() {
  const data = await getCommissionData();
  return (
    <CommissionClient
      initialDefaults={data.defaults}
      initialOverrides={data.customOverrides}
    />
  );
}
