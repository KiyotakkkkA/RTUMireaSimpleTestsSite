import { Icon } from "@iconify/react";

import { Button, Selector } from "../../../atoms";

import type { SelectorOption } from "../../../atoms/Selector";

interface TestsListFiltersPanelProps {
    sortValue: string;
    sortOptions: SelectorOption[];
    onSortChange: (value: string) => void;
    page: number;
    lastPage: number;
    isLoading: boolean;
    onPrevPage: () => void;
    onNextPage: () => void;
    onReset: () => void;
}

export const TestsListFiltersPanel = ({
    sortValue,
    sortOptions,
    onSortChange,
    page,
    lastPage,
    isLoading,
    onPrevPage,
    onNextPage,
    onReset,
}: TestsListFiltersPanelProps) => (
    <div className="sm:w-full lg:w-fit rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4">
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
        </div>
        <div className="mt-4 flex flex-col gap-4">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                    secondary
                    className="px-4 py-2 text-sm"
                    disabled={page <= 1 || isLoading}
                    onClick={onPrevPage}
                >
                    <Icon icon="mdi:arrow-left" className="h-5 w-5" />
                </Button>
                <div className="text-center text-sm text-slate-500 sm:text-left">
                    Страница{" "}
                    <span className="font-semibold text-slate-700">{page}</span>{" "}
                    из{" "}
                    <span className="font-semibold text-slate-700">
                        {lastPage}
                    </span>
                </div>
                <Button
                    primary
                    className="px-4 py-2 text-sm"
                    disabled={page >= lastPage || isLoading}
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
