import { makeAutoObservable, runInAction } from "mobx";

import { AdminService } from "../../services/admin";

import type {
    AdminStatisticsFilters,
    AdminStatisticsResponse,
} from "../../types/admin/AdminStatistics";

const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message || error?.message || fallback;

const isShallowEqual = (a: Record<string, any>, b: Record<string, any>) =>
    Object.keys(a).every((key) => a[key] === b[key]);

export class AdminStatisticsStore {
    statisticsData: AdminStatisticsResponse | null = null;
    statisticsFilters: AdminStatisticsFilters = {
        date_from: "",
        date_to: "",
        min_percentage: "",
    };
    statisticsLoading = false;
    statisticsError: string | null = null;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    get statisticsAppliedFilters(): AdminStatisticsFilters {
        return {
            date_from: this.statisticsFilters.date_from || undefined,
            date_to: this.statisticsFilters.date_to || undefined,
            min_percentage:
                this.statisticsFilters.min_percentage === ""
                    ? undefined
                    : this.statisticsFilters.min_percentage,
        };
    }

    updateStatisticsFilters(next: Partial<AdminStatisticsFilters>): void {
        const updated = { ...this.statisticsFilters, ...next };
        if (
            isShallowEqual(
                updated as Record<string, any>,
                this.statisticsFilters as Record<string, any>,
            )
        )
            return;
        this.statisticsFilters = updated;
    }

    async loadStatistics(): Promise<void> {
        try {
            this.statisticsLoading = true;
            this.statisticsError = null;
            const response = await AdminService.getStatistics(
                this.statisticsAppliedFilters,
            );
            runInAction(() => {
                this.statisticsData = response;
            });
        } catch (e: any) {
            runInAction(() => {
                this.statisticsError = getErrorMessage(
                    e,
                    "Не удалось загрузить статистику",
                );
            });
        } finally {
            runInAction(() => {
                this.statisticsLoading = false;
            });
        }
    }
}

export const adminStatisticsStore = new AdminStatisticsStore();
