import { useCallback, useEffect } from 'react';

import { adminUsersStore } from '../../stores/adminUsersStore';

import type { AdminUsersFilters } from '../../types/admin/AdminUsers';

export const useAdministrateUsers = () => {
  useEffect(() => {
    adminUsersStore.loadUsers();
  }, []);

  const updateFilters = useCallback((next: Partial<AdminUsersFilters>) => {
    adminUsersStore.updateUsersFilters(next);
  }, []);

  return {
    users: adminUsersStore.users,
    roles: adminUsersStore.roles,
    permissions: adminUsersStore.permissions,
    pagination: adminUsersStore.usersPagination,
    filters: adminUsersStore.usersFilters,
    updateFilters,
    isLoading: adminUsersStore.usersLoading,
    isAdding: adminUsersStore.usersAdding,
    error: adminUsersStore.usersError,
    deletingIds: adminUsersStore.usersDeletingIds,
    reload: adminUsersStore.loadUsers,
    createUser: adminUsersStore.createUser,
    deleteUser: adminUsersStore.deleteUser,
    updateUserRoles: adminUsersStore.updateUserRoles,
    updateUserPermissions: adminUsersStore.updateUserPermissions,
  };
};
