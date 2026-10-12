import { serverDb } from './db';
import { Booking } from '@/src/types/dashboard';

export async function getBookings(options?: {
  status?: string;
  search?: string;
}): Promise<Booking[]> {
  let list = serverDb.getBookings();

  if (options?.status && options.status !== 'All') {
    list = list.filter((b) => b.status === options.status);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.user.toLowerCase().includes(q) ||
        (b.customer && b.customer.toLowerCase().includes(q)) ||
        b.listing.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  return serverDb.getBookingById(id);
}

export async function updateBookingStatus(
  id: string,
  status: Booking['status']
): Promise<Booking | null> {
  return serverDb.updateBooking(id, { status });
}
