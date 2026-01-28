<?php

namespace App\Exceptions;

use Exception;

class ApiException extends Exception
{
    public int $statusCode;

    public array $errors;

    public function __construct(string $message, int $statusCode = 400, array $errors = [])
    {
        parent::__construct($message);
        
        $this->statusCode = $statusCode;
        $this->errors = $errors;
    }
}
