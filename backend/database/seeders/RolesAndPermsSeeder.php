<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'create tests',
            'edit tests',
            'delete tests',
            'add users',
            'remove users',
            'assign admin role',
            'assign editor role',
            'assign permissions',
            'view admin panel',
        ];

            $roles = [
                'root' => $permissions,
                'admin' => [
                    'create tests',
                    'edit tests',
                    'delete tests',
                    'add users',
                    'remove users',
                    'assign editor role',
                    'view admin panel',
                ],
                'editor' => [
                    'create tests',
                    'edit tests',
                    'delete tests',
                ],
                'user' => [],
            ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
 
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($rolePermissions);
        }
    }
}
