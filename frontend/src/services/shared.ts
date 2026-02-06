import { api } from "../configs/api";

import type {
    TestsAccessFilters,
    TestsAccessGroupsResponse,
    TestsAccessResponse,
    TestsAccessUpdatePayload,
    TestsAccessUsersResponse,
} from "../types/shared/TestsAccess";

import type {
    StatisticsDayFilters,
    StatisticsDayResponse,
    StatisticsFilters,
    StatisticsResponse,
} from "../types/shared/TestsStatistics";

export const SharedService = {
    getTestsAccessList: async (
        filters: TestsAccessFilters = {},
    ): Promise<TestsAccessResponse> => {
        const { data } = await api.get<TestsAccessResponse>(
            "/shared/tests/access",
            {
                params: filters,
            },
        );
        return data;
    },

    updateTestAccess: async (
        testId: string,
        payload: TestsAccessUpdatePayload,
    ): Promise<{ test: TestsAccessResponse["data"][number] }> => {
        const { data } = await api.patch(
            `/shared/tests/${testId}/access`,
            payload,
        );
        return data;
    },

    getTestsAccessUsers: async (params?: {
        search?: string;
        limit?: number;
    }): Promise<TestsAccessUsersResponse> => {
        const { data } = await api.get<TestsAccessUsersResponse>(
            "/shared/tests/access/users",
            { params },
        );
        return data;
    },

    getTestsAccessGroups: async (): Promise<TestsAccessGroupsResponse> => {
        const { data } = await api.get<TestsAccessGroupsResponse>(
            "/shared/tests/access/groups",
        );
        return data;
    },

    getStatistics: async (
        filters: StatisticsFilters = {},
    ): Promise<StatisticsResponse> => {
        const { data } = await api.get<StatisticsResponse>(
            "/shared/statistics",
            {
                params: filters,
            },
        );
        return data;
    },

    getStatisticsByDay: async (
        filters: StatisticsDayFilters,
    ): Promise<StatisticsDayResponse> => {
        const { data } = await api.get<StatisticsDayResponse>(
            "/shared/statistics/day",
            {
                params: filters,
            },
        );
        return data;
    },

    downloadStatisticsExcel: async (
        filters: StatisticsFilters = {},
    ): Promise<void> => {
        const { data, headers } = await api.get(
            "/download/shared/statistics/excel",
            {
                params: filters,
                responseType: "blob",
            },
        );

        const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const disposition = headers?.["content-disposition"] as
            | string
            | undefined;
        const match = disposition?.match(/filename="?([^";]+)"?/i);
        link.href = url;
        link.download = match?.[1] ?? "statistics.xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    downloadStatisticsDayExcel: async (
        filters: StatisticsDayFilters,
    ): Promise<void> => {
        const { data, headers } = await api.get(
            "/download/shared/statistics/day/excel",
            {
                params: filters,
                responseType: "blob",
            },
        );

        const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const disposition = headers?.["content-disposition"] as
            | string
            | undefined;
        const match = disposition?.match(/filename="?([^";]+)"?/i);
        link.href = url;
        link.download = match?.[1] ?? "statistics-day.xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};
