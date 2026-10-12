'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/src/context/AdminContext';
import { UserManagementView } from '@/src/components/users/UserManagementView';
import { UserManagementItem } from '@/src/types/dashboard';

interface UsersClientProps {
  initialUsers: UserManagementItem[];
}

export const UsersClient: React.FC<UsersClientProps> = ({ initialUsers }) => {
  const router = useRouter();
  const {
    users,
    handleAddUser,
    handleToggleUserStatus,
    handleUpdateUser,
    searchQuery,
  } = useAdmin();

  return (
    <UserManagementView
      users={users.length > 0 ? users : initialUsers}
      onAddUser={handleAddUser}
      onToggleStatus={handleToggleUserStatus}
      onUpdateUser={handleUpdateUser}
      searchFilter={searchQuery}
      onNavigateAddProvider={() => router.push('/users/add-provider')}
    />
  );
};
