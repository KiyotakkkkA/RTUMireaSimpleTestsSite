<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Filterable 
{
    public function queryFilterDependingOnPerms(Builder $query, string $dbDependingField, string $permission): Builder
    {
        if (!auth('sanctum')->user()->can($permission)) {
            $query->where($dbDependingField, auth('sanctum')->id());
        }

        return $query;
    }
}