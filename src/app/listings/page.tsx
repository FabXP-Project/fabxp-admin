// Server Component for Listings
import { getListings } from '@/src/lib/api/listings';
import { ListingsClient } from './ListingsClient';

export const metadata = {
  title: 'Listings | FabXP Admin',
  description: 'Manage platform listings, tours, stays, flights, and activities on FabXP.',
};

export default async function ListingsPage() {
  const listings = await getListings();
  return <ListingsClient initialListings={listings} />;
}
