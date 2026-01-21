import { useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { Button, SlidedPanel } from "../atoms"
import { authStore } from "../../stores/authStore";


const RightPart = observer(() => {
    if (authStore.isAuthorized) {
        return (
            <div className="hidden items-center gap-4 md:flex">
                <span className="text-sm text-slate-600">
                    {authStore.user?.name ?? 'Пользователь'}
                </span>
                <Button onClick={() => authStore.logout()} secondary className="py-2 px-3">
                    Выйти
                </Button>
            </div>
        );
    }

    return (
        <div className="hidden gap-4 md:flex">
            <Button to="/login" secondaryNoBorder className="py-2 px-3">Войти</Button>
            <Button to="/register" primary className="py-2 px-3">Регистрация</Button>
        </div>
    )
});

const LeftPart = () => {

    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-3">
            <div
                className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 cursor-pointer select-none"
                onClick={() => navigate("/")}
            >
                Testix
            </div>
        </div>
    )
}

export const Header = observer(() => {
    const [isOpenSlided, setIsOpenSlided] = useState(false);

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur">
            <div className="mx-auto flex items-center justify-between px-4 py-3 md:px-8">
                <LeftPart />
                <RightPart />

                <button
                    type="button"
                    className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 md:hidden"
                    onClick={() => setIsOpenSlided(true)}
                    aria-label="Открыть меню"
                >
                    <Icon icon="mdi:menu" className="h-7 w-7" />
                </button>
            </div>
            <SlidedPanel open={isOpenSlided} onClose={() => setIsOpenSlided(false)} title={
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Навигация
                </h2>
            }>
                <nav className="flex flex-col gap-3">
                    {authStore.isAuthorized ? (
                        <Button
                            onClick={() => {
                                authStore.logout();
                                setIsOpenSlided(false);
                            }}
                            secondary
                            className="py-2 px-3"
                        >
                            Выйти
                        </Button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600"
                                onClick={() => setIsOpenSlided(false)}
                            >
                                Войти
                            </Link>
                            <Link
                                to="/register"
                                className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-indigo-600"
                                onClick={() => setIsOpenSlided(false)}
                            >
                                Регистрация
                            </Link>
                        </>
                    )}
                </nav>
            </SlidedPanel>
        </header>
    )
})