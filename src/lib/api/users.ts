import { serverDb } from './db';
import { UserManagementItem } from '@/src/types/dashboard';

export async function getUsers(options?: {
  role?: 'Provider' | 'Partner';
  search?: string;
}): Promise<UserManagementItem[]> {
  let list = serverDb.getUsers();

  if (options?.role) {
    list = list.filter((u) => u.role === options.role);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
    );
  }

  return list;
}

export async function addUser(
  userData: Omit<UserManagementItem, 'id' | 'listingsCount'>
): Promise<UserManagementItem> {
  return serverDb.addUser(userData);
}

export async function toggleUserStatus(id: string): Promise<UserManagementItem | null> {
  return serverDb.toggleUserStatus(id);
}

export async function updateUser(
  id: string,
  updates: Partial<UserManagementItem>
): Promise<UserManagementItem | null> {
  return serverDb.updateUser(id, updates);
}
