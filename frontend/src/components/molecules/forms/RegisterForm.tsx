import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { observer } from "mobx-react-lite";

import { Button, InputSmall } from "../../atoms";
import { authStore } from "../../../stores/authStore";

const registerSchema = z.object({
    name: z.string().min(2, 'Введите имя'),
    email: z.string().email('Введите корректный email'),
    password: z.string().min(8, 'Пароль должен быть минимум 8 символов'),
    confirmPassword: z.string().min(8, 'Повторите пароль'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});

export const RegisterForm = observer(() => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setFormError(null);

        const parsed = registerSchema.safeParse({ name, email, password, confirmPassword });
        if (!parsed.success) {
            const nextErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
            parsed.error.issues.forEach((issue) => {
                const key = issue.path[0] as 'name' | 'email' | 'password' | 'confirmPassword';
                nextErrors[key] = issue.message;
            });
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        const ok = await authStore.register(name, email, password, confirmPassword);
        if (ok) {
            navigate('/', { replace: true });
            return;
        }
        setFormError(authStore.error ?? 'Не удалось зарегистрироваться');
    };

    return (
        <form className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Создать аккаунт</h2>
                <p className="text-sm text-slate-500">Зарегистрируйтесь за пару минут.</p>
            </div>
            <div className="flex flex-col gap-4">
                <div>
                    {errors.name && (
                        <span className="text-xs text-rose-600">{errors.name}</span>
                    )}
                    <InputSmall
                        name="name"
                        type="text"
                        placeholder="Имя пользователя"
                        leftIcon="mdi:account-outline"
                        autoComplete="name"
                        className="py-2 text-sm border-slate-200 bg-slate-50/80 shadow-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    {errors.email && (
                        <span className="text-xs text-rose-600">{errors.email}</span>
                    )}
                    <InputSmall
                        name="email"
                        type="email"
                        placeholder="Email"
                        leftIcon="mdi:email-outline"
                        autoComplete="email"
                        className="py-2 text-sm border-slate-200 bg-slate-50/80 shadow-sm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    {errors.password && (
                        <span className="text-xs text-rose-600">{errors.password}</span>
                    )}
                    <InputSmall
                        name="password"
                        type="password"
                        placeholder="Придумайте пароль"
                        leftIcon="mdi:lock-outline"
                        autoComplete="new-password"
                        className="py-2 text-sm border-slate-200 bg-slate-50/80 shadow-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    {errors.confirmPassword && (
                        <span className="text-xs text-rose-600">{errors.confirmPassword}</span>
                    )}
                    <InputSmall
                        name="confirmPassword"
                        type="password"
                        placeholder="Повторите пароль"
                        leftIcon="mdi:lock-outline"
                        autoComplete="new-password"
                        className="py-2 text-sm border-slate-200 bg-slate-50/80 shadow-sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>
            {formError && (
                <div className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-xs text-rose-700">
                    {formError}
                </div>
            )}
            <div className="mt-6 flex items-center justify-between">
                <Button primary className="flex-1 px-5 py-2 text-sm font-medium" onClick={() => {handleSubmit()}} disabled={authStore.isLoading}>
                    Регистрация
                </Button>
            </div>
        </form>
    );
});
