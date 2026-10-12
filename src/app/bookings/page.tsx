// Server Component for Bookings
import { getBookings } from '@/src/lib/api/bookings';
import { BookingsClient } from './BookingsClient';

export const metadata = {
  title: 'Bookings | FabXP Admin',
  description: 'Manage and review customer reservations on FabXP.',
};

export default async function BookingsPage() {
  const initialBookings = await getBookings();
  return <BookingsClient initialBookings={initialBookings} />;
}
