<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthRegisterRequest;
use App\Http\Requests\AuthVerifyRequest;
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

    public function register(AuthRegisterRequest $request): Response
    {
        $validated = $request->validated();

        $result = $this->authService->register($validated);

        return response([
            'message' => 'Сессия регистрации создана.',
            'user' => $result['user'],
            'verify_token' => $result['verify_token'],
        ], 201);
    }

    public function verify(AuthVerifyRequest $request): Response
    {
        $validated = $request->validated();

        $result = $this->authService->verifyEmail($validated);

        return response([
            'message' => 'Email подтвержден',
            'user' => $result['user'],
            'token' => $result['token'],
            'token_type' => $result['token_type'],
        ], 200);
    }

    public function login(AuthLoginRequest $request): Response
    {
        $validated = $request->validated();

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
