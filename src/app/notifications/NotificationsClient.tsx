'use client';

import React from 'react';
import { useAdmin } from '@/src/context/AdminContext';
import { NotificationsView } from '@/src/components/notifications/NotificationsView';
import { AppNotification } from '@/src/types/dashboard';

interface NotificationsClientProps {
  initialNotifications: AppNotification[];
}

export const NotificationsClient: React.FC<NotificationsClientProps> = ({
  initialNotifications,
}) => {
  const {
    notifications,
    handleMarkAllNotificationsAsRead,
    handleMarkNotificationAsRead,
    searchQuery,
  } = useAdmin();

  return (
    <NotificationsView
      notifications={notifications.length > 0 ? notifications : initialNotifications}
      onMarkAllAsRead={handleMarkAllNotificationsAsRead}
      onMarkAsRead={handleMarkNotificationAsRead}
      searchFilter={searchQuery}
    />
  );
};
