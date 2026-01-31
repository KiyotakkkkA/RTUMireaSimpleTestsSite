<?php

namespace App\Providers;

use App\Models\Test\Test;
use App\Models\User;
use App\Policies\TestPolicy;
use App\Policies\AdminUsersPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Test::class, TestPolicy::class);
        Gate::policy(User::class, AdminUsersPolicy::class);
    }
}
