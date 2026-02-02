<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

abstract class QueryFilter
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function apply(Builder $query): Builder
    {
        foreach ($this->filters as $name => $value) {
            $method = Str::camel($name);

            if (!method_exists($this, $method)) {
                continue;
            }

            if (!$this->isFilled($value)) {
                continue;
            }

            $this->{$method}($query, $value);
        }

        return $query;
    }

    protected function isFilled($value): bool
    {
        if (is_array($value)) {
            return !empty($value);
        }

        return $value !== null && $value !== '';
    }
}
