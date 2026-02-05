import { api } from "../configs/api";

import type {
    TestsAccessFilters,
    TestsAccessGroupsResponse,
    TestsAccessResponse,
    TestsAccessUpdatePayload,
    TestsAccessUsersResponse,
} from "../types/shared/TestsAccess";

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
};
