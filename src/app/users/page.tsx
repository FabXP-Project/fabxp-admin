// Server Component for Users
import { getUsers } from '@/src/lib/api/users';
import { UsersClient } from './UsersClient';

export const metadata = {
  title: 'User Management | FabXP Admin',
  description: 'Manage experience providers, partners, and user permissions on FabXP.',
};

export default async function UsersPage() {
  const users = await getUsers();
  return <UsersClient initialUsers={users} />;
}
