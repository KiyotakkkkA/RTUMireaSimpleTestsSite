import { useCallback, useEffect } from "react";

import { testsStatisticsDayStore } from "../../../stores/shared/testsStatisticsDayStore";

import type { StatisticsDayFilters } from "../../../types/shared/TestsStatistics";

export const useAdminStatisticsDayManage = (
    initialFilters?: StatisticsDayFilters,
) => {
    useEffect(() => {
        if (initialFilters) {
            testsStatisticsDayStore.updateFilters(initialFilters);
        }
    }, [initialFilters]);

    const updateFilters = useCallback((next: Partial<StatisticsDayFilters>) => {
        testsStatisticsDayStore.updateFilters(next);
    }, []);

    const resetFilters = useCallback(() => {
        testsStatisticsDayStore.resetFilters();
    }, []);

    return {
        filters: testsStatisticsDayStore.filters,
        appliedFilters: testsStatisticsDayStore.appliedFilters,
        updateFilters,
        resetFilters,
    };
};
