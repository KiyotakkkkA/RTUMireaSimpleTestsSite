<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\Admin\AdminUsersService;
use App\Services\Admin\AdminStatisticsService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    protected AdminUsersService $adminUsersService;
    protected AdminStatisticsService $adminStatisticsService;

    public function __construct(AdminUsersService $adminUsersService, AdminStatisticsService $adminStatisticsService)
    {
        $this->adminUsersService = $adminUsersService;
        $this->adminStatisticsService = $adminStatisticsService;
    }

    public function index(): Response
    {
        return response([
            'users' => $this->adminUsersService->listUsers(),
        ], 200);
    }

    public function roles(): Response
    {
        return response([
            'roles' => $this->adminUsersService->listRoles(),
        ], 200);
    }

    public function permissions(): Response
    {
        return response([
            'permissions' => $this->adminUsersService->listPermissions(),
        ], 200);
    }

    public function updateRoles(Request $request, User $user): Response
    {
        $validated = $request->validate([
            'roles' => ['required', 'array'],
            'roles.*' => ['string', Rule::exists('roles', 'name')],
        ]);

        $updated = $this->adminUsersService->updateRoles($request->user(), $user, $validated['roles']);

        return response([
            'user' => $updated,
        ], 200);
    }

    public function updatePermissions(Request $request, User $user): Response
    {
        $validated = $request->validate([
            'perms' => ['required', 'array'],
            'perms.*' => ['string', Rule::exists('permissions', 'name')],
        ]);

        $updated = $this->adminUsersService->updatePermissions($request->user(), $user, $validated['perms']);

        return response([
            'user' => $updated,
        ], 200);
    }

    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['nullable', 'string', Rule::exists('roles', 'name')],
        ], [
            'email.unique' => 'Email уже зарегистрирован',
            'password.confirmed' => 'Пароли не совпадают',
            'password.min' => 'Пароль должен быть минимум 8 символов',
        ]);

        $user = $this->adminUsersService->createUser($request->user(), $validated);

        return response([
            'user' => $user,
        ], 201);
    }

    public function destroy(Request $request, User $user): Response
    {
        $this->adminUsersService->deleteUser($request->user(), $user);

        return response([
            'message' => 'Пользователь удален',
        ], 200);
    }

    public function statistics(Request $request): Response
    {
        $validated = $request->validate([
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
            'min_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $data = $this->adminStatisticsService->getGeneralStatistics($validated);

        return response($data, 200);
    }
}
