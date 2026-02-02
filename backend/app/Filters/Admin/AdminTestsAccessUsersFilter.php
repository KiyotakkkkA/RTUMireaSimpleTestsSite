<?php

namespace App\Filters\Admin;

use App\Filters\QueryFilter;
use Illuminate\Database\Eloquent\Builder;

class AdminTestsAccessUsersFilter extends QueryFilter
{
    public function search(Builder $query, string $search): void
    {
        $query->where(function (Builder $builder) use ($search) {
            $builder
                ->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        });
    }
}
