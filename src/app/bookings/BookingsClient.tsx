'use client';

import React from 'react';
import { useAdmin } from '@/src/context/AdminContext';
import { BookingsView } from '@/src/components/bookings/BookingsView';
import { Booking } from '@/src/types/dashboard';

interface BookingsClientProps {
  initialBookings: Booking[];
}

export const BookingsClient: React.FC<BookingsClientProps> = ({ initialBookings }) => {
  const { bookings, setSelectedBooking, searchQuery } = useAdmin();

  return (
    <BookingsView
      bookings={bookings.length > 0 ? bookings : initialBookings}
      onSelectBooking={(b) => setSelectedBooking(b)}
      searchFilter={searchQuery}
    />
  );
};
