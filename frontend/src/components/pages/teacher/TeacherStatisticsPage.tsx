import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { Button } from "../../atoms";
import {
    TestsStatisticsByDay,
    TestsStatisticsGeneral,
} from "../../organisms/shared";
import { DataInformalBlock } from "../../molecules/shared";
import {
    TestsDayStatisticsFiltersPanel,
    TestsStatisticsFiltersPanel,
} from "../../molecules/filters/shared";
import {
    useAdminStatisticsAPI,
    useAdminStatisticsDayAPI,
    useAdminStatisticsDayManage,
    useAdminStatisticsManage,
} from "../../../hooks/admin/statistic";
import { SharedService } from "../../../services/shared";

type StatisticsViewMode = "general" | "target";

const formatRangeDate = (value: string) =>
    new Date(value).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

export const TeacherStatisticsPage = observer(() => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState<StatisticsViewMode>("general");
    const [isDownloading, setIsDownloading] = useState(false);
    const { filters, appliedFilters, updateFilters } =
        useAdminStatisticsManage();
    const dayTag = searchParams.get("tag");
    const dayValue = searchParams.get("value");
    const dayDate = dayTag === "date" && dayValue ? dayValue : "";
    const isDayView = Boolean(dayDate);

    const dayInitialFilters = useMemo(() => ({ date: dayDate }), [dayDate]);

    const {
        filters: dayFilters,
        appliedFilters: appliedDayFilters,
        updateFilters: updateDayFilters,
        resetFilters: resetDayFilters,
    } = useAdminStatisticsDayManage(dayInitialFilters);

    const { data, isLoading, error } = useAdminStatisticsAPI(appliedFilters, {
        enabled: !isDayView,
    });
    const {
        data: dayData,
        isLoading: isDayLoading,
        error: dayError,
    } = useAdminStatisticsDayAPI(appliedDayFilters, {
        enabled: isDayView,
    });

    const finished = data?.finished ?? {
        summary: {
            total_completions: 0,
            average_percentage: 0,
            unique_tests: 0,
        },
        series: [],
    };
    const started = data?.started ?? {
        summary: {
            total_completions: 0,
            average_percentage: 0,
            unique_tests: 0,
        },
        series: [],
    };

    const dayFinished = dayData?.finished ?? {
        summary: {
            total_completions: 0,
            average_percentage: 0,
            unique_tests: 0,
        },
        tests: [],
    };
    const dayStarted = dayData?.started ?? {
        summary: {
            total_completions: 0,
            average_percentage: 0,
            unique_tests: 0,
        },
        tests: [],
    };

    const percentOptions = [
        { value: "", label: "Любой процент" },
        { value: "50", label: "от 50%" },
        { value: "70", label: "от 70%" },
        { value: "80", label: "от 80%" },
        { value: "90", label: "от 90%" },
        { value: "100", label: "100%" },
    ];

    const canShiftRange = Boolean(filters.date_from && filters.date_to);

    const shiftRange = (direction: "prev" | "next") => {
        if (!filters.date_from || !filters.date_to) return;

        const from = new Date(filters.date_from);
        const to = new Date(filters.date_to);

        if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return;

        const rangeDays = Math.max(
            1,
            Math.round((to.getTime() - from.getTime()) / 86400000) + 1,
        );
        const delta = direction === "next" ? rangeDays : -rangeDays;

        const nextFrom = new Date(from);
        nextFrom.setDate(nextFrom.getDate() + delta);

        const nextTo = new Date(to);
        nextTo.setDate(nextTo.getDate() + delta);

        updateFilters({
            date_from: nextFrom.toISOString().slice(0, 10),
            date_to: nextTo.toISOString().slice(0, 10),
        });
    };

    const rangeLabel = useMemo(() => {
        if (filters.date_from && filters.date_to) {
            return `${formatRangeDate(filters.date_from)} — ${formatRangeDate(filters.date_to)}`;
        }
        if (filters.date_from) {
            return `с ${formatRangeDate(filters.date_from)}`;
        }
        if (filters.date_to) {
            return `по ${formatRangeDate(filters.date_to)}`;
        }
        return "Весь период";
    }, [filters.date_from, filters.date_to]);

    const normalizedDownloadFilters = useMemo(
        () => ({
            date_from: appliedFilters.date_from || undefined,
            date_to: appliedFilters.date_to || undefined,
            min_percentage:
                appliedFilters.min_percentage === ""
                    ? undefined
                    : appliedFilters.min_percentage,
        }),
        [appliedFilters],
    );

    const normalizedDayDownloadFilters = useMemo(
        () => ({
            date: appliedDayFilters.date,
            time_from: appliedDayFilters.time_from || undefined,
            time_to: appliedDayFilters.time_to || undefined,
            min_percentage:
                appliedDayFilters.min_percentage === ""
                    ? undefined
                    : appliedDayFilters.min_percentage,
        }),
        [appliedDayFilters],
    );

    const handlePercentChange = (value: string) => {
        const parsed = value === "" ? "" : Number(value);
        updateFilters({ min_percentage: Number.isNaN(parsed) ? "" : parsed });
    };

    const handleDayPercentChange = (value: string) => {
        const parsed = value === "" ? "" : Number(value);
        updateDayFilters({
            min_percentage: Number.isNaN(parsed) ? "" : parsed,
        });
    };

    const handleResetFilters = () => {
        updateFilters({ date_from: "", date_to: "", min_percentage: "" });
    };

    const handleDayResetFilters = () => {
        resetDayFilters();
    };

    const handleBack = () => {
        resetDayFilters();
        navigate("/teacher/statistics");
    };

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            if (isDayView) {
                await SharedService.downloadStatisticsDayExcel(
                    normalizedDayDownloadFilters,
                );
                return;
            }
            await SharedService.downloadStatisticsExcel(
                normalizedDownloadFilters,
            );
        } finally {
            setIsDownloading(false);
        }
    };

    const activeLoading = isDayView ? isDayLoading : isLoading;
    const activeError = isDayView ? dayError : error;
    const activeLoadingMessage = isDayView
        ? "Загрузка статистики по дню..."
        : "Загрузка статистики...";
    const dayLabel = dayDate ? formatRangeDate(dayDate) : "";

    return (
        <div className="flex flex-col gap-4 lg:flex-row animate-fade-in">
            <div className="order-2 flex-1 space-y-4 lg:order-1">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="text-2xl font-semibold text-slate-800">
                                {isDayView
                                    ? `Статистика за ${dayLabel}`
                                    : "Статистика"}
                            </div>
                            <div className="text-sm text-slate-500">
                                {isDayView
                                    ? "Детальная статистика по выбранному дню."
                                    : "Общая динамика прохождений и качество результатов."}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {isDayView ? (
                                <Button
                                    secondary
                                    className="px-4 py-2 text-sm"
                                    onClick={handleBack}
                                >
                                    Назад
                                </Button>
                            ) : (
                                <Button
                                    primary={viewMode === "general"}
                                    secondary={viewMode !== "general"}
                                    className="px-4 py-2 text-sm"
                                    onClick={() => setViewMode("general")}
                                >
                                    Общая
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <DataInformalBlock
                    isLoading={activeLoading}
                    isError={!!activeError}
                    loadingMessage={activeLoadingMessage}
                    errorMessage={
                        activeError || "Не удалось загрузить статистику."
                    }
                />

                {!activeLoading &&
                    !activeError &&
                    !isDayView &&
                    viewMode === "general" && (
                        <div className="space-y-6">
                            <TestsStatisticsGeneral
                                series={finished.series}
                                summary={finished.summary}
                                title="Тестов завершено"
                                totalLabel="Всего пройдено"
                                tooltipTotalLabel="Всего пройдено"
                                detailsPath="/teacher/statistics"
                            />
                            <TestsStatisticsGeneral
                                series={started.series}
                                summary={started.summary}
                                title="Тестов начато"
                                totalLabel="Всего начато"
                                blocks={{
                                    totalStats: true,
                                    averagePercentage: false,
                                    uniqueTests: true,
                                }}
                                tooltipTotalLabel="Всего начато"
                                detailsPath="/teacher/statistics"
                            />
                        </div>
                    )}

                {!activeLoading && !activeError && isDayView && (
                    <div className="space-y-6">
                        <TestsStatisticsByDay
                            summary={dayFinished.summary}
                            tests={dayFinished.tests}
                            title="Тестов завершено"
                            totalLabel="Всего пройдено"
                        />
                        <TestsStatisticsByDay
                            summary={dayStarted.summary}
                            tests={dayStarted.tests}
                            title="Тестов начато"
                            totalLabel="Всего начато"
                            blocks={{
                                totalStats: true,
                                averagePercentage: false,
                                averageTime: false,
                                uniqueTests: true,
                            }}
                        />
                    </div>
                )}

                {!activeLoading &&
                    !activeError &&
                    !isDayView &&
                    viewMode === "target" && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 shadow-sm">
                            Выберите тест, чтобы увидеть детальную статистику.
                            Скоро здесь появятся фильтры и графики по одному
                            тесту.
                        </div>
                    )}
            </div>
            <div className="order-1 w-full shrink-0 lg:order-2 lg:max-w-sm">
                {isDayView ? (
                    <TestsDayStatisticsFiltersPanel
                        minPercentageValue={String(
                            dayFilters.min_percentage ?? "",
                        )}
                        percentOptions={percentOptions}
                        onPercentChange={handleDayPercentChange}
                        timeFrom={dayFilters.time_from ?? ""}
                        timeTo={dayFilters.time_to ?? ""}
                        onTimeFromChange={(value) =>
                            updateDayFilters({ time_from: value })
                        }
                        onTimeToChange={(value) =>
                            updateDayFilters({ time_to: value })
                        }
                        isDownloading={isDownloading}
                        onDownload={handleDownload}
                        onReset={handleDayResetFilters}
                    />
                ) : (
                    <TestsStatisticsFiltersPanel
                        minPercentageValue={String(
                            filters.min_percentage ?? "",
                        )}
                        percentOptions={percentOptions}
                        onPercentChange={handlePercentChange}
                        dateFrom={filters.date_from ?? ""}
                        dateTo={filters.date_to ?? ""}
                        onDateFromChange={(value) =>
                            updateFilters({ date_from: value })
                        }
                        onDateToChange={(value) =>
                            updateFilters({ date_to: value })
                        }
                        rangeLabel={rangeLabel}
                        canShiftRange={canShiftRange}
                        isLoading={isLoading}
                        isDownloading={isDownloading}
                        onPrevRange={() => shiftRange("prev")}
                        onNextRange={() => shiftRange("next")}
                        onDownload={handleDownload}
                        onReset={handleResetFilters}
                    />
                )}
            </div>
        </div>
    );
});
