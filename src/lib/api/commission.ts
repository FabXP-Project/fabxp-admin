import { serverDb } from './db';
import { CommissionDefaults, CustomCommissionOverride } from '@/src/types/dashboard';

export async function getCommissionData(): Promise<{
  defaults: CommissionDefaults;
  customOverrides: CustomCommissionOverride[];
}> {
  return {
    defaults: serverDb.getCommissionDefaults(),
    customOverrides: serverDb.getCustomOverrides(),
  };
}

export async function updateCommissionDefaults(
  defaults: CommissionDefaults
): Promise<CommissionDefaults> {
  return serverDb.setCommissionDefaults(defaults);
}

export async function updateCommissionOverride(
  id: string,
  rate: number
): Promise<CustomCommissionOverride | null> {
  return serverDb.updateCustomOverride(id, rate);
}

export async function addCommissionOverride(
  partner: string,
  category: string,
  rate: number
): Promise<CustomCommissionOverride> {
  return serverDb.addCustomOverride(partner, category, rate);
}
