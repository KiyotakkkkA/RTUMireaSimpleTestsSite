<?php

namespace App\Services;

use App\Exceptions\ApiException;
use App\Models\User;
use App\Services\MailService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class AuthService
{
    protected MailService $mailService;
    
    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    public function register(array $data): array
    {
        if (User::where('email', $data['email'])->exists()) {
            throw new ApiException('Email уже зарегистрирован', 422);
        }

        $verifyToken = Str::random(64);
        $plainCode = (string) random_int(100000, 999999);
        
        $status = $this->mailService->sendEmailVerification([
            'email' => $data['email'],
            'name' => $data['name'],
        ], $plainCode, $verifyToken);
        if (!$status) {
            throw new ApiException('Не удалось отправить письмо с подтверждением', 500);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'verify_token' => $verifyToken,
            'hashed_email_code' => Hash::make($plainCode),
        ]);

        if (Role::where('name', 'user')->exists()) {
            $user->assignRole('user');
        }

        return [
            'user' => $this->formatUser($user),
            'verify_token' => $verifyToken,
        ];
    }

    public function verifyEmail(array $payload): array
    {
        $user = User::where('verify_token', $payload['verify_token'])->first();

        if (!$user) {
            throw new ApiException('Запроса на подтверждение не найдено', 401);
        }

        if ($user->email_verified_at) {
            throw new ApiException('Email уже подтвержден', 409);
        }

        if (!$user->hashed_email_code || !Hash::check($payload['code'], $user->hashed_email_code)) {
            throw new ApiException('Неверный код подтверждения', 422);
        }

        $user->forceFill([
            'email_verified_at' => now(),
            'verify_token' => null,
            'hashed_email_code' => null,
        ])->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $this->formatUser($user),
            'token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    public function login(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw new ApiException('Неправильный логин или пароль', 401);
        }

        $expiresAt = $credentials['rememberMe'] ? null : now()->addHours(12);

        $token = $user->createToken('auth_token', [], $expiresAt)->plainTextToken;

        return [
            'user' => $this->formatUser($user),
            'token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    public function getCurrentUser(): ?array
    {
        $user = Auth::user();
        if (!$user) {
            return null;
        }

        return $this->formatUser($user);
    }

    public function logout(): bool
    {
        $user = Auth::user();
        if ($user) {
            $user->tokens()->delete();
            return true;
        }
        return false;
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'roles' => $user->getRoleNames()->values()->all(),
            'perms' => $user->getAllPermissions()->pluck('name')->values()->all(),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
