import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import {
    ArrayAutoFillSelector,
    Button,
    InputCheckbox,
    InputDate,
    InputTime,
    Selector,
    Spinner,
} from "../../../atoms";

import type { ArrayAutoFillOption } from "../../../atoms/ArrayAutoFillSelector";
import type {
    TestAccessItem,
    TestsAccessStatus,
    TestsAccessUpdatePayload,
} from "../../../../types/shared/TestsAccess";

type TestAccessCardProps = {
    test: TestAccessItem;
    userOptions: ArrayAutoFillOption[];
    isUpdating?: boolean;
    onAccessSave: (
        testId: string,
        payload: TestsAccessUpdatePayload,
    ) => Promise<void>;
};

type AccessVisibilityValue = "all" | "auth" | "custom";

const statusOptions: { value: AccessVisibilityValue; label: string }[] = [
    { value: "all", label: "Доступен всем" },
    { value: "auth", label: "Только авторизованные" },
    { value: "custom", label: "Настраиваемое" },
];

const statusMeta: Record<
    TestsAccessStatus,
    { label: string; icon: string; className: string }
> = {
    all: {
        label: "Доступен всем",
        icon: "mdi:earth",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    auth: {
        label: "Только авторизованные",
        icon: "mdi:account-check",
        className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    },
    custom: {
        label: "Настраиваемое",
        icon: "mdi:tune-variant",
        className: "bg-amber-50 text-amber-700 ring-amber-200",
    },
};

export const TestAccessCard = ({
    test,
    userOptions,
    isUpdating,
    onAccessSave,
}: TestAccessCardProps) => {
    const splitDateTime = (value?: string | null) => {
        if (!value) return { date: "", time: "" };
        const [datePart, timePart] = value.split(" ");
        return {
            date: datePart ?? "",
            time: (timePart ?? "").slice(0, 5),
        };
    };

    const buildDateTime = (date: string, time: string) =>
        date && time ? `${date} ${time}` : null;

    const initialUserIds = useMemo(
        () => test.access_users.map((user) => String(user.id)),
        [test.access_users],
    );
    const [selectedUserIds, setSelectedUserIds] =
        useState<string[]>(initialUserIds);
    const [isSavingUsers, setIsSavingUsers] = useState(false);
    const [copied, setCopied] = useState(false);
    const [linkOnly, setLinkOnly] = useState(Boolean(test.access_link));
    const [{ date: fromDate, time: fromTime }, setFromState] = useState(() =>
        splitDateTime(test.access_from),
    );
    const [{ date: toDate, time: toTime }, setToState] = useState(() =>
        splitDateTime(test.access_to),
    );

    useEffect(() => {
        setSelectedUserIds(initialUserIds);
        setLinkOnly(Boolean(test.access_link));
        setFromState(splitDateTime(test.access_from));
        setToState(splitDateTime(test.access_to));
    }, [initialUserIds, test.access_link, test.access_from, test.access_to]);

    const handleUsersSave = async () => {
        const ids = selectedUserIds.map((value) => Number(value));
        const payload: TestsAccessUpdatePayload = {
            access_status: "custom",
            user_ids: linkOnly ? [] : ids,
            link_only: linkOnly,
            access_from: buildDateTime(fromDate, fromTime),
            access_to: buildDateTime(toDate, toTime),
        };
        setIsSavingUsers(true);
        try {
            await onAccessSave(test.id, payload);
        } finally {
            setIsSavingUsers(false);
        }
    };

    const accessLink = useMemo(() => {
        if (!test.access_link) return null;
        if (typeof window === "undefined") return test.access_link;
        return `${window.location.origin}/tests/${test.id}/start?access_link=${test.access_link}`;
    }, [test.access_link, test.id]);

    const handleCopy = async () => {
        if (!accessLink) return;
        try {
            await navigator.clipboard.writeText(accessLink);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    const statusDetails = statusMeta[test.access_status];
    const visibilityValue: AccessVisibilityValue =
        test.access_status === "custom"
            ? "custom"
            : (test.access_status as AccessVisibilityValue);

    const initialLinkOnly = Boolean(test.access_link);
    const initialFrom = splitDateTime(test.access_from);
    const initialTo = splitDateTime(test.access_to);
    const hasWindowChanges =
        fromDate !== initialFrom.date ||
        fromTime !== initialFrom.time ||
        toDate !== initialTo.date ||
        toTime !== initialTo.time;
    const hasLinkChange = linkOnly !== initialLinkOnly;
    const hasUsersChanges = useMemo(() => {
        if (selectedUserIds.length !== initialUserIds.length) return true;
        const set = new Set(initialUserIds);
        return selectedUserIds.some((id) => !set.has(id));
    }, [initialUserIds, selectedUserIds]);
    const hasCustomChanges =
        hasUsersChanges || hasLinkChange || hasWindowChanges;

    if (isUpdating) {
        return (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <Spinner className="h-8 w-8 text-slate-400" />
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <div className="text-lg font-semibold text-slate-800 break-words">
                        {test.title}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                        Вопросов:{" "}
                        {test.total_questions - (test.total_disabled ?? 0)}
                    </div>
                    <div className="mt-3">
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusDetails.className}`}
                        >
                            <Icon
                                icon={statusDetails.icon}
                                className="h-4 w-4"
                            />
                            {statusDetails.label}
                        </span>
                    </div>
                </div>
                <div className="w-full md:w-64">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Видимость
                    </div>
                    <Selector
                        value={visibilityValue}
                        options={statusOptions}
                        onChange={(value) => {
                            const nextValue = value as AccessVisibilityValue;
                            const payload: TestsAccessUpdatePayload = {
                                access_status:
                                    nextValue === "custom"
                                        ? "custom"
                                        : nextValue,
                                link_only: nextValue === "custom" && linkOnly,
                                access_from: buildDateTime(fromDate, fromTime),
                                access_to: buildDateTime(toDate, toTime),
                            };
                            if (nextValue === "custom") {
                                payload.user_ids = linkOnly
                                    ? []
                                    : selectedUserIds.map((id) => Number(id));
                            }
                            onAccessSave(test.id, payload);
                        }}
                        disabled={Boolean(isUpdating)}
                    />
                </div>
            </div>

            {visibilityValue === "custom" && (
                <div className="mt-5 space-y-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-100 p-4">
                        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Доступ по времени
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <InputDate
                                    label="С"
                                    value={fromDate}
                                    onChange={(event) =>
                                        setFromState((prev) => ({
                                            ...prev,
                                            date: event.target.value,
                                        }))
                                    }
                                    disabled={Boolean(isUpdating)}
                                />
                                <InputTime
                                    label="Время"
                                    value={fromTime}
                                    onChange={(event) =>
                                        setFromState((prev) => ({
                                            ...prev,
                                            time: event.target.value,
                                        }))
                                    }
                                    disabled={Boolean(isUpdating)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <InputDate
                                    label="По"
                                    value={toDate}
                                    onChange={(event) =>
                                        setToState((prev) => ({
                                            ...prev,
                                            date: event.target.value,
                                        }))
                                    }
                                    disabled={Boolean(isUpdating)}
                                />
                                <InputTime
                                    label="Время"
                                    value={toTime}
                                    onChange={(event) =>
                                        setToState((prev) => ({
                                            ...prev,
                                            time: event.target.value,
                                        }))
                                    }
                                    disabled={Boolean(isUpdating)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-100 px-4 py-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-800">
                                Только по ссылке
                            </div>
                            <div className="text-xs text-slate-500">
                                Доступ к тесту только по специальной ссылке.
                            </div>
                        </div>
                        <InputCheckbox
                            checked={linkOnly}
                            onChange={setLinkOnly}
                            title="Только по ссылке"
                        />
                    </div>
                </div>
            )}

            {visibilityValue === "custom" && linkOnly && (
                <div className="mt-4">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Ссылка
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 break-all">
                            {accessLink ?? "Ссылка не сгенерирована"}
                        </div>
                        {accessLink && (
                            <Button
                                disabled={copied}
                                secondary
                                className="px-4 py-2 text-sm"
                                onClick={handleCopy}
                            >
                                {copied ? "Скопировано" : "Скопировать"}
                            </Button>
                        )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Button
                            primary
                            className="px-4 py-2 text-sm"
                            isLoading={isSavingUsers}
                            loadingText="Сохраняем..."
                            disabled={
                                !hasCustomChanges ||
                                isSavingUsers ||
                                Boolean(isUpdating)
                            }
                            onClick={handleUsersSave}
                        >
                            Сохранить доступ
                        </Button>
                        {hasCustomChanges && !isSavingUsers && (
                            <Button
                                secondary
                                className="px-4 py-2 text-sm"
                                onClick={() => {
                                    setSelectedUserIds(initialUserIds);
                                    setLinkOnly(initialLinkOnly);
                                    setFromState(initialFrom);
                                    setToState(initialTo);
                                }}
                            >
                                Сбросить
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {visibilityValue === "custom" && !linkOnly && (
                <div className="mt-5">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Разрешённые пользователи
                    </div>
                    <div className="space-y-3">
                        <ArrayAutoFillSelector
                            options={userOptions}
                            value={selectedUserIds}
                            onChange={setSelectedUserIds}
                            placeholder="Выберите пользователей"
                            disabled={Boolean(isUpdating)}
                        />
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                primary
                                className="px-4 py-2 text-sm"
                                isLoading={isSavingUsers}
                                loadingText="Сохраняем..."
                                disabled={
                                    !hasCustomChanges ||
                                    isSavingUsers ||
                                    Boolean(isUpdating)
                                }
                                onClick={handleUsersSave}
                            >
                                Сохранить доступ
                            </Button>
                            {hasCustomChanges && !isSavingUsers && (
                                <Button
                                    secondary
                                    className="px-4 py-2 text-sm"
                                    onClick={() => {
                                        setSelectedUserIds(initialUserIds);
                                        setLinkOnly(initialLinkOnly);
                                        setFromState(initialFrom);
                                        setToState(initialTo);
                                    }}
                                >
                                    Сбросить
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
