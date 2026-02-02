<?php

namespace App\Filters\Admin;

use App\Filters\QueryFilter;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class AdminAuditFilter extends QueryFilter
{
    public function actionType(Builder $query, string $value): void
    {
        $query->where('action_type', $value);
    }

    public function dateFrom(Builder $query, string $value): void
    {
        $from = Carbon::parse($value)->startOfDay();
        $query->where('created_at', '>=', $from);
    }

    public function dateTo(Builder $query, string $value): void
    {
        $to = Carbon::parse($value)->endOfDay();
        $query->where('created_at', '<=', $to);
    }
}
