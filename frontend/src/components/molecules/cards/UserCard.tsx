import { useState } from 'react';

import { UserRolesForm } from '../forms';

import type { User } from '../../../types/User';
import type { RoleOption } from '../../../services/admin';
import { Button, Spinner } from '../../atoms';

export type UserCardProps = {
  user: User;
  roles: RoleOption[];
  permissions: string[];
  permissionLabels?: Record<string, string>;
  rolePermissionsMap: Record<string, string[]>;
  maxRoleRank: number;
  isSelf: boolean;
  isRankHigher?: boolean;
  canDelete: boolean;
  isDeleting?: boolean;
  onDelete: (userId: number) => Promise<void>;
  onSaveRoles: (userId: number, roles: string[]) => Promise<void>;
  onSavePermissions: (userId: number, perms: string[]) => Promise<void>;
  canAssignPermissions: boolean;
};

export const UserCard = ({
  user,
  roles,
  permissions,
  permissionLabels,
  rolePermissionsMap,
  maxRoleRank,
  isSelf,
  isRankHigher,
  canDelete,
  isDeleting,
  onDelete,
  onSaveRoles,
  onSavePermissions,
  canAssignPermissions,
}: UserCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-lg font-semibold text-slate-800 break-words">{user.name}</div>
          <div className="text-sm text-slate-500 break-all">{user.email}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(user.roles ?? []).map((role) => (
              <span
                key={role}
                className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600"
              >
                {role}
              </span>
            ))}
            {(user.perms ?? []).map((perm) => (
              <span
                key={perm}
                className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
              >
                {permissionLabels?.[perm] ?? perm}
              </span>
            ))}
          </div>
        </div>
        { !isSelf ? (
            <div className="flex justify-between flex-wrap gap-2 sm:flex-nowrap sm:flex-shrink-0">
                { isRankHigher && (
                  <Button
                    primaryNoBackground
                    className="text-sm whitespace-nowrap"
                    onClick={() => {
                      if (isSelf) return;
                      setIsOpen((prev) => !prev);
                    }}
                  >
                    {isOpen ? 'Скрыть' : 'Редактировать'}
                  </Button>
                )}
                {canDelete && (
                  <Button
                    danger
                    className="py-1 px-3 text-sm whitespace-nowrap"
                    disabled={isDeleting}
                    onClick={async () => {
                      if (!window.confirm('Удалить пользователя?')) return;
                      await onDelete(user.id);
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      {isDeleting && <Spinner className="h-4 w-4" />}
                      Удалить
                    </span>
                  </Button>
                )}
            </div>
        ) : (
            <div className="flex-shrink-0 rounded-full border border-indigo-600 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
                Вы
            </div>
        )}
      </div>

      {isOpen && (
        <div className="mt-5 border-t border-slate-100 pt-5">
          <UserRolesForm
            user={user}
            roles={roles}
            permissions={permissions}
            permissionLabels={permissionLabels}
            rolePermissionsMap={rolePermissionsMap}
            maxRoleRank={maxRoleRank}
            isSelf={isSelf}
            onSaveRoles={(roles) => onSaveRoles(user.id, roles)}
            onSavePermissions={(perms) => onSavePermissions(user.id, perms)}
            canAssignPermissions={canAssignPermissions}
          />
        </div>
      )}
    </div>
  );
};
