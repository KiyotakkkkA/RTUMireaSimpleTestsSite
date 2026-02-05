import { Icon } from "@iconify/react";

import { Button, InputSmall, Selector, Spinner } from "../../../atoms";

import type { SelectorOption } from "../../../atoms/Selector";

interface TestsAccessFiltersPanelProps {
    sortValue: string;
    sortOptions: SelectorOption[];
    onSortChange: (value: string) => void;
    userSearch: string;
    onUserSearchChange: (value: string) => void;
    usersLoading: boolean;
    usersError?: string | null;
    pagination: { page: number; last_page: number };
    isLoading: boolean;
    onPrevPage: () => void;
    onNextPage: () => void;
    onReset: () => void;
}

export const TestsAccessFiltersPanel = ({
    sortValue,
    sortOptions,
    onSortChange,
    userSearch,
    onUserSearchChange,
    usersLoading,
    usersError,
    pagination,
    isLoading,
    onPrevPage,
    onNextPage,
    onReset,
}: TestsAccessFiltersPanelProps) => (
    <div className="sm:w-full lg:w-fit rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <div className="grid gap-4">
            <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Сортировка
                </div>
                <Selector
                    value={sortValue}
                    options={sortOptions}
                    onChange={onSortChange}
                />
            </div>
            <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Поиск пользователей
                </div>
                <InputSmall
                    value={userSearch}
                    onChange={(event) => onUserSearchChange(event.target.value)}
                    placeholder="Имя или email"
                    className="p-2"
                />
                {usersLoading && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                        <Spinner className="h-3 w-3" />
                        Загружаем пользователей...
                    </div>
                )}
                {usersError && (
                    <div className="mt-2 text-xs text-rose-600">
                        {usersError}
                    </div>
                )}
            </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                    secondary
                    className="px-4 py-2 text-sm"
                    disabled={pagination.page <= 1 || isLoading}
                    onClick={onPrevPage}
                >
                    <Icon icon="mdi:arrow-left" className="h-5 w-5" />
                </Button>
                <div className="text-center text-sm text-slate-500 sm:text-left">
                    Страница{" "}
                    <span className="font-semibold text-slate-700">
                        {pagination.page}
                    </span>{" "}
                    из{" "}
                    <span className="font-semibold text-slate-700">
                        {pagination.last_page}
                    </span>
                </div>
                <Button
                    primary
                    className="px-4 py-2 text-sm"
                    disabled={
                        pagination.page >= pagination.last_page || isLoading
                    }
                    onClick={onNextPage}
                >
                    <Icon icon="mdi:arrow-right" className="h-5 w-5" />
                </Button>
            </div>
            <Button
                dangerInverted
                className="px-4 py-2 text-sm"
                onClick={onReset}
            >
                Сбросить фильтры
            </Button>
        </div>
    </div>
);
