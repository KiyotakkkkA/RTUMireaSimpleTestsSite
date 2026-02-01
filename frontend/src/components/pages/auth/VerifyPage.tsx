import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "../../atoms";
import { authStore } from "../../../stores/authStore";
import { useToasts } from "../../../hooks/useToasts";

import type React from "react";

export const VerifyPage = () => {
    const navigate = useNavigate();
    const { toast } = useToasts();

    const [searchParams] = useSearchParams();
    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const [token, setToken] = useState<string>("");
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            setToken(token);
        }
    }, [searchParams]);

    const indices = useMemo(() => Array.from({ length: 6 }, (_, i) => i), []);

    const focusInput = (index: number) => {
        inputsRef.current[index]?.focus();
        inputsRef.current[index]?.select();
    };

    const handleChange = (index: number, value: string) => {
        const nextValue = value.replace(/\D/g, "").slice(-1);
        setCode((prev) => {
            const updated = [...prev];
            updated[index] = nextValue;
            return updated;
        });

        if (nextValue && index < 5) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (
        index: number,
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === "Backspace" && !code[index] && index > 0) {
            focusInput(index - 1);
            return;
        }

        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            focusInput(index - 1);
            return;
        }

        if (event.key === "ArrowRight" && index < 5) {
            event.preventDefault();
            focusInput(index + 1);
        }
    };

    const handleSubmit = async () => {
        if (!token) return;
        const joinedCode = code.join("");
        const ok = await authStore.verifyEmail({
            verify_token: token,
            code: joinedCode,
        });
        if (ok) {
            toast.success("Регистрация успешно завершена");
            navigate("/", { replace: true });
        }
    };

    return (
        <div className="flex w-full justify-center items-center">
            <div className="w-full max-w-md">
                <div className="w-full bg-slate-50 p-6 shadow-lg rounded-lg">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-slate-800">
                            Подтвердите почту
                        </h2>
                        <p className="text-sm text-slate-500">
                            Введите 6-значный код из письма, чтобы продолжить.
                        </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        {indices.map((index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                aria-label={`Цифра ${index + 1}`}
                                className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-200/80 text-center text-lg font-semibold text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                placeholder="•"
                                value={code[index]}
                                onChange={(event) =>
                                    handleChange(index, event.target.value)
                                }
                                onKeyDown={(event) =>
                                    handleKeyDown(index, event)
                                }
                                ref={(element) => {
                                    inputsRef.current[index] = element;
                                }}
                                autoComplete="one-time-code"
                            />
                        ))}
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                        <Button
                            primary
                            className="flex-1 px-5 py-2 text-sm font-medium"
                            type="submit"
                            onClick={handleSubmit}
                            disabled={authStore.isLoading}
                        >
                            Подтвердить
                        </Button>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                        <span>Не получили код?</span>
                        <Button
                            disabled
                            className="text-indigo-600 hover:underline"
                        >
                            Отправить ещё раз
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
