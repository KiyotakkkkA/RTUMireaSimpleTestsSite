<?php

namespace App\Filters\Admin;

use App\Filters\QueryFilter;
use Illuminate\Database\Eloquent\Builder;

class AdminUsersFilter extends QueryFilter
{
    public function search(Builder $query, string $search): void
    {
        $query->where(function (Builder $builder) use ($search) {
            $builder
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        });
    }

    public function role(Builder $query, string $role): void
    {
        $query->whereHas('roles', function (Builder $builder) use ($role) {
            $builder->where('name', $role);
        });
    }

    public function permissions(Builder $query, $permissions): void
    {
        $permissions = is_array($permissions) ? $permissions : [$permissions];
        $permissions = array_filter($permissions);

        foreach ($permissions as $permission) {
            $query->where(function (Builder $builder) use ($permission) {
                $builder
                    ->whereHas('permissions', function (Builder $permQuery) use ($permission) {
                        $permQuery->where('name', $permission);
                    })
                    ->orWhereHas('roles.permissions', function (Builder $rolePermQuery) use ($permission) {
                        $rolePermQuery->where('name', $permission);
                    });
            });
        }
    }
}
