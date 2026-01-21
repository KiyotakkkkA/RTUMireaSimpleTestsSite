<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService)
    {}

    public function register(Request $request): Response
    {
        try {
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
                'message' => 'User успешно зарегистрирован',
                'user' => $result['user'],
                'token' => $result['token'],
                'token_type' => $result['token_type'],
            ], 201);
        } catch (ValidationException $e) {
            return response([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request): Response
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $result = $this->authService->login($validated);

            return response([
                'message' => 'Успешная авторизация',
                'user' => $result['user'],
                'token' => $result['token'],
                'token_type' => $result['token_type'],
            ], 200);
        } catch (ValidationException $e) {
            return response([
                'message' => 'Login failed',
                'errors' => $e->errors(),
            ], 401);
        } catch (\Exception $e) {
            return response([
                'message' => 'Login error',
                'error' => $e->getMessage(),
            ], 500);
        }
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
        try {
            $this->authService->logout();

            return response([
                'message' => 'Успешно вышли',
            ], 200);
        } catch (\Exception $e) {
            return response([
                'message' => 'Logout error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
