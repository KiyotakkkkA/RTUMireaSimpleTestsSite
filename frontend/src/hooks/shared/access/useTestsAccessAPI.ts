import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { SharedService } from "../../../services/shared";

import type {
    TestsAccessFilters,
    TestsAccessPagination,
    TestsAccessUpdatePayload,
} from "../../../types/shared/TestsAccess";

const DEFAULT_PAGINATION: TestsAccessPagination = {
    page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
};

const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message || error?.message || fallback;

export const useAdminTestsAccessAPI = (
    filters: TestsAccessFilters,
    userSearch?: string,
) => {
    const queryClient = useQueryClient();

    const testsQuery = useQuery(
        ["shared", "tests-access", filters],
        () => SharedService.getTestsAccessList(filters),
        { keepPreviousData: true },
    );

    const usersQuery = useQuery(
        ["shared", "tests-access", "users", userSearch ?? ""],
        () =>
            SharedService.getTestsAccessUsers({
                search: userSearch || undefined,
                limit: 100,
            }),
        { keepPreviousData: true },
    );

    const groupsQuery = useQuery(
        ["shared", "tests-access", "groups"],
        () => SharedService.getTestsAccessGroups(),
        { keepPreviousData: true },
    );

    const [accessUpdating, setAccessUpdating] = useState<
        Record<string, boolean>
    >({});
    const updateAccessMutation = useMutation(
        ({
            testId,
            payload,
        }: {
            testId: string;
            payload: TestsAccessUpdatePayload;
        }) => SharedService.updateTestAccess(testId, payload),
        {
            onMutate: ({ testId }) => {
                setAccessUpdating((prev) => ({ ...prev, [testId]: true }));
            },
            onSettled: (_data, _error, variables) => {
                setAccessUpdating((prev) => {
                    const next = { ...prev };
                    delete next[variables.testId];
                    return next;
                });
            },
            onSuccess: () => {
                queryClient.invalidateQueries(["shared", "tests-access"]);
            },
        },
    );

    return {
        tests: testsQuery.data?.data ?? [],
        pagination: testsQuery.data?.pagination ?? DEFAULT_PAGINATION,
        isLoading: testsQuery.isLoading,
        isFetching: testsQuery.isFetching,
        error: testsQuery.error
            ? getErrorMessage(
                  testsQuery.error,
                  "Не удалось загрузить список тестов",
              )
            : null,
        refetch: testsQuery.refetch,
        users: usersQuery.data?.data ?? [],
        usersLoading: usersQuery.isLoading,
        usersFetching: usersQuery.isFetching,
        usersError: usersQuery.error
            ? getErrorMessage(
                  usersQuery.error,
                  "Не удалось загрузить пользователей",
              )
            : null,
        usersRefetch: usersQuery.refetch,
        groups: groupsQuery.data?.data ?? [],
        groupsLoading: groupsQuery.isLoading,
        groupsFetching: groupsQuery.isFetching,
        groupsError: groupsQuery.error
            ? getErrorMessage(groupsQuery.error, "Не удалось загрузить группы")
            : null,
        groupsRefetch: groupsQuery.refetch,
        updateTestAccess: (testId: string, payload: TestsAccessUpdatePayload) =>
            updateAccessMutation
                .mutateAsync({ testId, payload })
                .then((resp) => resp.test),
        accessUpdating,
    };
};
