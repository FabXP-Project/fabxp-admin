// Server Component for Payouts
import { getPayouts } from '@/src/lib/api/payouts';
import { PayoutsClient } from './PayoutsClient';

export const metadata = {
  title: 'Payouts | FabXP Admin',
  description: 'Manage provider settlements and automated disbursements on FabXP.',
};

export default async function PayoutsPage() {
  const payouts = await getPayouts();
  return <PayoutsClient initialPayouts={payouts} />;
}
