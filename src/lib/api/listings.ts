import { serverDb } from './db';
import { ListingItem } from '@/src/types/dashboard';

export async function getListings(options?: {
  status?: string;
  category?: string;
  search?: string;
}): Promise<ListingItem[]> {
  let list = serverDb.getListings();

  if (options?.status && options.status !== 'All Listings') {
    list = list.filter((item) => item.status === options.status);
  }

  if (options?.category && options.category !== 'All') {
    list = list.filter((item) => item.category === options.category);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.submittedBy.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function updateListing(
  id: string,
  updates: Partial<ListingItem>
): Promise<ListingItem | null> {
  return serverDb.updateListing(id, updates);
}
