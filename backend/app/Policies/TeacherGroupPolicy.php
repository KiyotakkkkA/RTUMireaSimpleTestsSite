<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\User;
use App\Enum\ErrorMessages;
use Illuminate\Auth\Access\Response;

class TeacherGroupPolicy
{
    public function update(User $user, Group $group): Response
    {
        if (!$this->canManage($user, $group)) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_GROUP_UPDATE->value);
        }

        return Response::allow();
    }

    public function delete(User $user, Group $group): Response
    {
        if (!$this->canManage($user, $group)) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_GROUP_DELETE->value);
        }

        return Response::allow();
    }

    private function canManage(User $user, Group $group): bool
    {
        // Группа всегда доступна ее создателю и пользователям с мастер-доступом
        return $group->created_by === $user->id || $user->can('groups master access');
    }
}
