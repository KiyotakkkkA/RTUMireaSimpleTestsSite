<?php

namespace App\Filters\Tests;

use App\Filters\QueryFilter;
use Illuminate\Database\Eloquent\Builder;

class TestsStatisticsDayFilter extends QueryFilter
{
    private bool $applyMinPercentage;

    public function __construct(array $filters = [], bool $applyMinPercentage = true)
    {
        parent::__construct($filters);
        $this->applyMinPercentage = $applyMinPercentage;
    }

    public function timeFrom(string $value): Builder
    {
        return $this->builder->where('created_at', '>=', $value);
    }

    public function timeTo(string $value): Builder
    {
        return $this->builder->where('created_at', '<=', $value);
    }

    public function minPercentage($value): Builder
    {
        if (!$this->applyMinPercentage) {
            return $this->builder;
        }

        return $this->builder->where('percentage', '>=', $value);
    }
}