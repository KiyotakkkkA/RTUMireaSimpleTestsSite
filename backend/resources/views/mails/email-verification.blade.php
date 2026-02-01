<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Завершение регистрации</title>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;color:#0F172A;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F8FAFC;padding:32px 16px;">
    <tr>
        <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background-color:#FFFFFF;border-radius:16px;box-shadow:0 10px 30px rgba(15,23,42,0.08);overflow:hidden;">
                <tr>
                    <td style="padding:28px 28px 8px 28px;">
                        <div style="font-size:18px;font-weight:700;color:#1E293B;">Testix</div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 28px 0 28px;">
                        <h1 style="margin:0;font-size:22px;line-height:1.3;color:#0F172A;">Завершите регистрацию</h1>
                        <p style="margin:8px 0 0 0;font-size:14px;line-height:1.6;color:#475569;">Здравствуйте, {{ $name }}! Введите код ниже, чтобы подтвердить вашу почту и завершить регистрацию.</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 28px 0 28px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                            <tr>
                                <td align="center" style="background-color:#EEF2FF;border:1px solid #E2E8F0;border-radius:12px;padding:18px;">
                                    <div style="letter-spacing:8px;font-size:28px;font-weight:700;color:#4F46E5;">{{ $code }}</div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                @if(!empty($verifyUrl))
                <tr>
                    <td style="padding:20px 28px 0 28px;">
                        <a href="{{ $verifyUrl }}" style="display:inline-block;background-color:#6366F1;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:14px;padding:12px 18px;border-radius:10px;">Подтвердить email</a>
                    </td>
                </tr>
                @endif
                <tr>
                    <td style="padding:16px 28px 0 28px;">
                        <p style="margin:0;font-size:12px;line-height:1.6;color:#64748B;">Код действует ограниченное время. Если вы не регистрировались, просто проигнорируйте это письмо.</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:24px 28px 28px 28px;">
                        <div style="font-size:12px;color:#94A3B8;">© {{ date('Y') }} Testix. Все права защищены.</div>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
