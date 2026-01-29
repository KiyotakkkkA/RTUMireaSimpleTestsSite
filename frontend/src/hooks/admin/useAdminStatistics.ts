import { useCallback, useEffect } from "react";

import { adminStatisticsStore } from "../../stores/adminStatisticsStore";

import type { AdminStatisticsFilters } from "../../types/admin/AdminStatistics";

export const useAdminStatistics = (initialFilters?: AdminStatisticsFilters) => {
    useEffect(() => {
        if (initialFilters) {
            adminStatisticsStore.updateStatisticsFilters(initialFilters);
        }
    }, [initialFilters]);

    useEffect(() => {
        adminStatisticsStore.loadStatistics();
    }, []);

    const updateFilters = useCallback(
        (next: Partial<AdminStatisticsFilters>) => {
            adminStatisticsStore.updateStatisticsFilters(next);
        },
        [],
    );

    return {
        data: adminStatisticsStore.statisticsData,
        isLoading: adminStatisticsStore.statisticsLoading,
        error: adminStatisticsStore.statisticsError,
        filters: adminStatisticsStore.statisticsFilters,
        reload: adminStatisticsStore.loadStatistics,
        updateFilters,
    };
};
