'use client';

import React from 'react';
import { useAdmin } from '@/src/context/AdminContext';
import { ListingsView } from '@/src/components/listings/ListingsView';
import { ListingItem } from '@/src/types/dashboard';

interface ListingsClientProps {
  initialListings: ListingItem[];
}

export const ListingsClient: React.FC<ListingsClientProps> = ({ initialListings }) => {
  const { listings, searchQuery } = useAdmin();

  return (
    <ListingsView
      listings={listings.length > 0 ? listings : initialListings}
      searchFilter={searchQuery}
    />
  );
};
