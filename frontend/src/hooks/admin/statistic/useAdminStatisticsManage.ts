import { useCallback, useEffect } from "react";

import { adminStatisticsStore } from "../../../stores/admin/adminStatisticsStore";

import type { StatisticsFilters } from "../../../types/shared/TestsStatistics";

export const useAdminStatisticsManage = (
    initialFilters?: StatisticsFilters,
) => {
    useEffect(() => {
        if (initialFilters) {
            adminStatisticsStore.updateStatisticsFilters(initialFilters);
        }
    }, [initialFilters]);

    const updateFilters = useCallback((next: Partial<StatisticsFilters>) => {
        adminStatisticsStore.updateStatisticsFilters(next);
    }, []);

    return {
        filters: adminStatisticsStore.statisticsFilters,
        appliedFilters: adminStatisticsStore.statisticsAppliedFilters,
        updateFilters,
    };
};
