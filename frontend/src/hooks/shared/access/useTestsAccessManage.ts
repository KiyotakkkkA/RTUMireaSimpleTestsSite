import { useCallback, useEffect } from "react";

import { testsAccessStore } from "../../../stores/shared/testsAccessStore";

import type { TestsAccessFilters } from "../../../types/shared/TestsAccess";

export const useAdminTestsAccessManage = (
    initialFilters?: TestsAccessFilters,
) => {
    useEffect(() => {
        if (initialFilters) {
            testsAccessStore.updateFilters(initialFilters);
        }
    }, [initialFilters]);

    const updateFilters = useCallback((next: Partial<TestsAccessFilters>) => {
        testsAccessStore.updateFilters(next);
    }, []);

    return {
        filters: testsAccessStore.filters,
        appliedFilters: testsAccessStore.appliedFilters,
        updateFilters,
    };
};
