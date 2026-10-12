import { serverDb } from './db';
import { AppNotification } from '@/src/types/dashboard';

export async function getNotifications(options?: {
  category?: string;
  search?: string;
}): Promise<AppNotification[]> {
  let list = serverDb.getNotifications();

  if (options?.category && options.category !== 'All') {
    list = list.filter((n) => n.category === options.category);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function markNotificationAsRead(id: string): Promise<AppNotification | null> {
  return serverDb.markNotificationRead(id);
}

export async function markAllNotificationsAsRead(): Promise<AppNotification[]> {
  return serverDb.markAllNotificationsRead();
}
