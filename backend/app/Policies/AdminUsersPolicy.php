<?php

namespace App\Policies;

use App\Models\User;
use App\Enum\ErrorMessages;
use Illuminate\Auth\Access\Response;

class AdminUsersPolicy
{
    public function updateRoles(User $user, User $target): Response
    {
        $status = $user->hasRole('root')
            || $user->can('assign admin role')
            || $user->can('assign editor role')
            || $user->can('assign teacher role');
        if (!$status) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_ADMIN_ROLES_UPDATE->value);
        }
        return Response::allow();
    }
}
