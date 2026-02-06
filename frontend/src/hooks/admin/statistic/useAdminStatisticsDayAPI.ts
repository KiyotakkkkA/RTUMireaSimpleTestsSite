import { useQuery } from "react-query";

import { SharedService } from "../../../services/shared";

import type {
    StatisticsDayFilters,
    StatisticsDayResponse,
} from "../../../types/shared/TestsStatistics";

const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message || error?.message || fallback;

const normalizeFilters = (
    filters: StatisticsDayFilters,
): StatisticsDayFilters => ({
    date: filters.date,
    time_from: filters.time_from || undefined,
    time_to: filters.time_to || undefined,
    min_percentage:
        filters.min_percentage === "" ? undefined : filters.min_percentage,
});

export const useAdminStatisticsDayAPI = (
    filters: StatisticsDayFilters,
    options?: { enabled?: boolean },
) => {
    const appliedFilters = normalizeFilters(filters);

    const query = useQuery<StatisticsDayResponse>(
        ["admin", "statistics", "day", appliedFilters],
        () => SharedService.getStatisticsByDay(appliedFilters),
        { keepPreviousData: true, enabled: options?.enabled },
    );

    return {
        data: query.data ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error
            ? getErrorMessage(query.error, "Не удалось загрузить статистику")
            : null,
        refetch: query.refetch,
    };
};
