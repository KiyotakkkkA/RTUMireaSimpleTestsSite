import { makeAutoObservable } from "mobx";

import type { StatisticsDayFilters } from "../../types/shared/TestsStatistics";

const isShallowEqual = (a: Record<string, any>, b: Record<string, any>) =>
    Object.keys(a).every((key) => a[key] === b[key]);

export class TestsStatisticsDayStore {
    filters: StatisticsDayFilters = {
        date: "",
        time_from: "",
        time_to: "",
        min_percentage: "",
    };

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    get appliedFilters(): StatisticsDayFilters {
        return {
            date: this.filters.date,
            time_from: this.filters.time_from || undefined,
            time_to: this.filters.time_to || undefined,
            min_percentage:
                this.filters.min_percentage === ""
                    ? undefined
                    : this.filters.min_percentage,
        };
    }

    updateFilters(next: Partial<StatisticsDayFilters>): void {
        const updated = { ...this.filters, ...next };
        if (
            isShallowEqual(
                updated as Record<string, any>,
                this.filters as Record<string, any>,
            )
        )
            return;
        this.filters = updated;
    }

    resetFilters(): void {
        this.filters = {
            date: this.filters.date,
            time_from: "",
            time_to: "",
            min_percentage: "",
        };
    }
}

export const testsStatisticsDayStore = new TestsStatisticsDayStore();
