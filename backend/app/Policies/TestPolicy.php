<?php

namespace App\Policies;

use App\Models\Test\Test;
use App\Models\User;
use App\Enum\ErrorMessages;
use Illuminate\Auth\Access\Response;

class TestPolicy
{
    public function view(User $user, Test $test): Response
    {
        $status = $this->canManage($user, $test) && $user->can('edit tests');
        if (!$status) {
            return Response::denyAsNotFound(ErrorMessages::RES_NOT_FOUND->value);
        }
        return Response::allow();
    }

    public function create(User $user): Response
    {
        $status = $user->can('create tests');
        if (!$status) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_TEST_CREATE->value);
        }
        return Response::allow();
    }

    public function update(User $user, Test $test): Response
    {
        $status = $this->canManage($user, $test) && $user->can('edit tests');
        if (!$status) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_TEST_UPDATE->value);
        }
        return Response::allow();
    }

    public function delete(User $user, Test $test): Response
    {
        $status = $this->canManage($user, $test) && $user->can('delete tests');
        if (!$status) {
            return Response::denyAsNotFound(ErrorMessages::RES_NOT_FOUND->value);
        }
        return Response::allow();
    }

    public function export(User $user, Test $test): Response
    {
        $status = $this->canManage($user, $test) && $user->can('make reports');
        if (!$status) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_TEST_EXPORT->value);
        }
        return Response::allow();
    }

    public function autoFill(User $user, Test $test): Response
    {
        $status = $this->canManage($user, $test) && $user->can('edit tests');
        if (!$status) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_TEST_AUTOFILL->value);
        }
        return Response::allow();
    }

    private function canManage(User $user, Test $test): bool
    {
        return $test->creator_id === $user->id || $user->can('tests master access');
    }
}
