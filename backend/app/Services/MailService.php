<?php

namespace App\Services;

use App\Mail\Auth\EmailVerificationMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class MailService
{
    public function sendEmailVerification(array $creds, string $code, string $verifyToken): bool
    {
        $verifyUrl = url('/verify?token='.$verifyToken);

        Mail::to($creds['email'])->send(new EmailVerificationMail(
            $creds['name'],
            $code,
            $verifyUrl,
        ));

        return true;
    }
}
