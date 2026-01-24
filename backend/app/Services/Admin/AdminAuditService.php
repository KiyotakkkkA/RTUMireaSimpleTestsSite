<?php

namespace App\Services\Admin;

use App\Models\Audit;
use App\Models\User;

class AdminAuditService
{
    public const ACTION_ADMIN_ROLES_CHANGE = 'admin_roles_change';
    public const ACTION_ADMIN_PERMISSIONS_CHANGE = 'admin_permissions_change';
    public const ACTION_ADMIN_USER_ADD = 'admin_user_add';
    public const ACTION_ADMIN_USER_REMOVE = 'admin_user_remove';
    public const ACTION_TEST_CREATED = 'test_created';
    public const ACTION_TEST_UPDATED = 'test_updated';
    public const ACTION_TEST_DELETED = 'test_deleted';

    public function auditAdminRolesChange(User $actor, User $target, array $oldRoles, array $newRoles): void
    {
        $this->storeAudit(
            $actor,
            self::ACTION_ADMIN_ROLES_CHANGE,
            [
                'user' => $this->mapUserSnapshot($target),
                'roles' => array_values($oldRoles),
            ],
            [
                'user' => $this->mapUserSnapshot($target),
                'roles' => array_values($newRoles),
            ],
            'Изменение ролей пользователя'
        );
    }

    public function auditAdminPermissionsChange(User $actor, User $target, array $oldPerms, array $newPerms): void
    {
        $this->storeAudit(
            $actor,
            self::ACTION_ADMIN_PERMISSIONS_CHANGE,
            [
                'user' => $this->mapUserSnapshot($target),
                'permissions' => array_values($oldPerms),
            ],
            [
                'user' => $this->mapUserSnapshot($target),
                'permissions' => array_values($newPerms),
            ],
            'Изменение прав пользователя'
        );
    }

    public function auditAdminUserAdd(User $actor, User $createdUser, array $roles, array $perms): void
    {
        $this->storeAudit(
            $actor,
            self::ACTION_ADMIN_USER_ADD,
            null,
            [
                'user' => $this->mapUserSnapshot($createdUser),
                'roles' => array_values($roles),
                'permissions' => array_values($perms),
            ],
            'Добавление пользователя'
        );
    }

    public function auditAdminUserRemove(User $actor, User $removedUser, array $roles, array $perms): void
    {
        $this->storeAudit(
            $actor,
            self::ACTION_ADMIN_USER_REMOVE,
            [
                'user' => $this->mapUserSnapshot($removedUser),
                'roles' => array_values($roles),
                'permissions' => array_values($perms),
            ],
            null,
            'Удаление пользователя'
        );
    }

    public function auditTestCreated(User $actor, array $testSnapshot): void
    {
        $this->storeAudit(
            $actor,
            self::ACTION_TEST_CREATED,
            null,
            [
                'test' => $testSnapshot,
            ],
            'Создание теста'
        );
    }

    public function auditTestUpdated(User $actor, array $testSnapshot, array $changedQuestions): void
    {
        $this->storeAudit(
            $actor,
            self::ACTION_TEST_UPDATED,
            null,
            [
                'test' => $testSnapshot,
                'changed_questions' => array_values($changedQuestions),
            ],
            'Обновление теста'
        );
    }

    public function auditTestDeleted(User $actor, array $testSnapshot): void
    {
        $this->storeAudit(
            $actor,
            self::ACTION_TEST_DELETED,
            [
                'test' => $testSnapshot,
            ],
            null,
            'Удаление теста'
        );
    }

    private function storeAudit(User $actor, string $actionType, ?array $oldState, ?array $newState, ?string $comment = null): void
    {
        Audit::create([
            'user_id' => $actor->id,
            'action_type' => $actionType,
            'old_object_state' => $oldState,
            'new_object_state' => $newState,
            'comment' => $comment,
        ]);
    }

    private function mapUserSnapshot(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }
}
