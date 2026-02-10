import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";

import { DataInformalBlock } from "../../molecules/shared";
import { TeacherTestAccessCard } from "../../molecules/cards/teacher";
import { TestsAccessFiltersPanel } from "../../molecules/filters/shared";
import {
    useAdminTestsAccessAPI,
    useAdminTestsAccessManage,
} from "../../../hooks/shared/access";
import { useToasts } from "../../../hooks/useToasts";

import type { ArrayAutoFillOption } from "../../atoms/ArrayAutoFillSelector";
import type { TestsAccessUpdatePayload } from "../../../types/shared/TestsAccess";

export const TeacherTestsAccessPage = observer(() => {
    const { toast } = useToasts();
    const { filters, appliedFilters, updateFilters } =
        useAdminTestsAccessManage();
    const [userSearch, setUserSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const {
        tests,
        pagination,
        isLoading,
        error,
        users,
        usersLoading,
        usersError,
        groups,
        updateTestAccess,
        accessUpdating,
    } = useAdminTestsAccessAPI(appliedFilters, debouncedSearch || undefined);
    const isUpdating = useMemo(() => ({ ...accessUpdating }), [accessUpdating]);

    const sortOptions = useMemo(
        () => [
            { value: "title_asc", label: "По названию (А→Я)" },
            { value: "title_desc", label: "По названию (Я→А)" },
        ],
        [],
    );

    const sortValue = useMemo(() => {
        if (filters.sort_dir === "desc") return "title_desc";
        return "title_asc";
    }, [filters.sort_dir]);

    const userOptions = useMemo<ArrayAutoFillOption[]>(
        () =>
            users.map((user) => ({
                value: String(user.id),
                label: user.name,
                description: user.email,
            })),
        [users],
    );

    const groupOptions = useMemo<ArrayAutoFillOption[]>(
        () =>
            groups.map((group) => ({
                value: String(group.id),
                label: group.name,
                description: `${group.participants_count} участников`,
            })),
        [groups],
    );

    useEffect(() => {
        const handle = window.setTimeout(() => {
            setDebouncedSearch(userSearch.trim());
        }, 300);
        return () => window.clearTimeout(handle);
    }, [userSearch]);

    const handleAccessSave = async (
        testId: string,
        payload: TestsAccessUpdatePayload,
    ) => {
        try {
            await updateTestAccess(testId, payload);
            toast.success("Доступ обновлён");
        } catch (e: any) {
            toast.danger(
                e?.response?.data?.message || "Не удалось обновить доступ",
            );
        }
    };

    const resetFilters = () => {
        updateFilters({
            page: 1,
            sort_by: "title",
            sort_dir: "asc",
        });
        setUserSearch("");
        setDebouncedSearch("");
    };

    return (
        <div className="flex flex-col gap-4 lg:flex-row animate-fade-in">
            <div className="order-2 flex-1 space-y-4 lg:order-1">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-2xl font-semibold text-slate-800">
                                Доступ к тестам
                            </div>
                            <div className="text-sm text-slate-500">
                                Настраивайте видимость тестов и выдавайте доступ
                                выбранным пользователям.
                            </div>
                        </div>
                    </div>
                </div>

                <DataInformalBlock
                    isLoading={isLoading}
                    isError={!!error}
                    isEmpty={tests.length === 0 && !isLoading && !error}
                    loadingMessage="Загрузка тестов..."
                    errorMessage={error || "Не удалось загрузить тесты."}
                    emptyMessage="Тестов не найдено."
                />

                {!isLoading && !error && tests.length > 0 && (
                    <div className="space-y-4">
                        {tests.map((test) => (
                            <TeacherTestAccessCard
                                key={test.id}
                                test={test}
                                userOptions={userOptions}
                                groupOptions={groupOptions}
                                groups={groups}
                                isUpdating={Boolean(isUpdating[test.id])}
                                onAccessSave={handleAccessSave}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="order-1 w-full shrink-0 lg:order-2 lg:max-w-sm">
                <TestsAccessFiltersPanel
                    sortValue={sortValue}
                    sortOptions={sortOptions}
                    onSortChange={(value) =>
                        updateFilters({
                            sort_by: "title",
                            sort_dir: value === "title_desc" ? "desc" : "asc",
                        })
                    }
                    userSearch={userSearch}
                    onUserSearchChange={setUserSearch}
                    usersLoading={usersLoading}
                    usersError={usersError}
                    pagination={pagination}
                    isLoading={isLoading}
                    onPrevPage={() =>
                        updateFilters({ page: pagination.page - 1 })
                    }
                    onNextPage={() =>
                        updateFilters({ page: pagination.page + 1 })
                    }
                    onReset={resetFilters}
                />
            </div>
        </div>
    );
});
