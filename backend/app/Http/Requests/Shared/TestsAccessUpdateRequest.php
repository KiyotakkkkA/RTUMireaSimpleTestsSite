<?php

namespace App\Http\Requests\Shared;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TestsAccessUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'access_status' => ['sometimes', 'string', Rule::in(['all', 'auth', 'custom'])],
            'user_ids' => ['sometimes', 'array'],
            'user_ids.*' => ['integer', 'exists:users,id'],
            'link_only' => ['sometimes', 'boolean'],
            'access_from' => ['nullable', 'date_format:Y-m-d H:i'],
            'access_to' => ['nullable', 'date_format:Y-m-d H:i', 'after_or_equal:access_from'],
        ];
    }
}
