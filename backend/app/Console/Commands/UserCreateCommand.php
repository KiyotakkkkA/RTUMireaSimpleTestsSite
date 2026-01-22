<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use App\Models\User;

class UserCreateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-user {name} {email} {role} {--password=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user with a specified role and optional password';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $roleCheckingStatus = Role::where('name', $this->argument('role'))->exists();
        if (!$roleCheckingStatus) {
            $this->error("Role '{$this->argument('role')}' does not exist.");
            return Command::FAILURE;
        }

        $emailCheckingStatus = User::where('email', $this->argument('email'))->exists();
        if ($emailCheckingStatus) {
            $this->error("User with email '{$this->argument('email')}' already exists.");
            return Command::FAILURE;
        }

        $password = $this->option('password') ?? Str::random(12);

        $user = User::create([
            'name' => $this->argument('name'),
            'email' => $this->argument('email'),
            'password' => Hash::make($password),
        ]);

        $user->assignRole($this->argument('role'));

        $this->info("User '{$this->argument('name')}' with role '{$this->argument('role')}' created successfully.");
        if (!$this->option('password')) {
            $this->info("GENERATED PASSWORD: {$password}");
        }
        return Command::SUCCESS;
    }
}
