<?php

namespace App\Policies;

use App\Models\Audit;
use App\Models\User;
use App\Enum\ErrorMessages;
use Illuminate\Auth\Access\Response;

class AdminAuditPolicy
{
    public function viewAny(User $user): Response
    {
        $status = $user->can('view audit logs');
        if (!$status) {
            return Response::deny(ErrorMessages::NOT_ALLOWED_AUDIT_VIEW->value);
        }
        return Response::allow();
    }
}
