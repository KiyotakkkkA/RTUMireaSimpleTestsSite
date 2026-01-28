<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    protected AuthService $authService;
    
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function register(Request $request): Response
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.unique' => 'Email уже зарегистрирован',
            'password.confirmed' => 'Пароли не совпадают',
            'password.min' => 'Пароль должен быть минимум 8 символов',
        ]);

        $result = $this->authService->register($validated);

        return response([
            'message' => 'Пользователь успешно зарегистрирован',
            'user' => $result['user'],
            'token' => $result['token'],
            'token_type' => $result['token_type'],
        ], 201);
    }

    public function login(Request $request): Response
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'rememberMe' => 'required|boolean',
        ]);

        $result = $this->authService->login($validated);

        return response([
            'message' => 'Успешная авторизация',
            'user' => $result['user'],
            'token' => $result['token'],
            'token_type' => $result['token_type'],
        ], 200);
    }

    public function me(Request $request): Response
    {
        $user = $this->authService->getCurrentUser();

        if (!$user) {
            return response([
                'message' => 'Не авторизован',
            ], 401);
        }

        return response([
            'user' => $user,
        ], 200);
    }

    public function logout(Request $request): Response
    {
        $this->authService->logout();

        return response([
            'message' => 'Успешно вышли',
        ], 200);
    }
}
