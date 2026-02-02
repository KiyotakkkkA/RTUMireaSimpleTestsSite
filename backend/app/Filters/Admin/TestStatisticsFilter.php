<?php

namespace App\Filters\Admin;

use App\Filters\QueryFilter;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class TestStatisticsFilter extends QueryFilter
{
    private bool $applyMinPercentage;

    public function __construct(array $filters = [], bool $applyMinPercentage = true)
    {
        parent::__construct($filters);
        $this->applyMinPercentage = $applyMinPercentage;
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

    public function minPercentage(Builder $query, $value): void
    {
        if (!$this->applyMinPercentage) {
            return;
        }

        $query->where('percentage', '>=', $value);
    }
}
