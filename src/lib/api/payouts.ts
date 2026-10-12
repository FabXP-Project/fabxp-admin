import { serverDb } from './db';
import { PayoutItem } from '@/src/types/dashboard';

export async function getPayouts(options?: { search?: string }): Promise<PayoutItem[]> {
  let list = serverDb.getPayouts();
  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.provider.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    );
  }
  return list;
}

export async function approvePayout(id: string): Promise<PayoutItem | null> {
  return serverDb.approvePayout(id);
}
