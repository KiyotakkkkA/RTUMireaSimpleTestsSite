<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthVerifyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'verify_token' => 'required|string',
            'code' => 'required|string|size:6|regex:/^[0-9]{6}$/',
        ];
    }

    public function messages(): array
    {
        return [
            'code.size' => 'Код должен содержать 6 цифр',
            'code.regex' => 'Код должен содержать только цифры',
        ];
    }
}
