<?php

namespace App\Policies;

use App\Models\User;
use App\Enum\ErrorMessages;
use Illuminate\Auth\Access\Response;

class AdminUsersPolicy
{
    public function viewAny(User $user): Response
    {
        return Response::allow();
    }

    public function create(User $user): Response
    {
        $status = $user->can('add users');
        if (!$status) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_ADMIN_USERS_CREATE->value);
        }
        return Response::allow();
    }

    public function updateRoles(User $user, User $target): Response
    {
        $status = $user->hasRole('root')
            || $user->can('assign admin role')
            || $user->can('assign editor role');
        if (!$status) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_ADMIN_ROLES_UPDATE->value);
        }
        return Response::allow();
    }

    public function updatePermissions(User $user, User $target): Response
    {
        $status = $user->can('assign permissions');
        if (!$status) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_ADMIN_PERMISSIONS_UPDATE->value);
        }
        return Response::allow();
    }

    public function delete(User $user, User $target): Response
    {
        $status = $user->can('remove users');
        if (!$status) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_ADMIN_USERS_DELETE->value);
        }
        return Response::allow();
    }
}
