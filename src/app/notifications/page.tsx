// Server Component for Notifications
import { getNotifications } from '@/src/lib/api/notifications';
import { NotificationsClient } from './NotificationsClient';

export const metadata = {
  title: 'Notifications | FabXP Admin',
  description: 'Activity logs, approvals, and system alerts on FabXP.',
};

export default async function NotificationsPage() {
  const notifications = await getNotifications();
  return <NotificationsClient initialNotifications={notifications} />;
}
