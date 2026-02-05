import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { SharedService } from "../../../services/shared";

import type {
    TestsAccessFilters,
    TestsAccessPagination,
    TestsAccessStatus,
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

    const [statusUpdating, setStatusUpdating] = useState<
        Record<string, boolean>
    >({});
    const updateStatusMutation = useMutation(
        ({ testId, status }: { testId: string; status: TestsAccessStatus }) =>
            SharedService.updateTestAccess(testId, { access_status: status }),
        {
            onMutate: ({ testId }) => {
                setStatusUpdating((prev) => ({ ...prev, [testId]: true }));
            },
            onSettled: (_data, _error, variables) => {
                setStatusUpdating((prev) => {
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

    const [usersUpdating, setUsersUpdating] = useState<Record<string, boolean>>(
        {},
    );
    const updateUsersMutation = useMutation(
        ({ testId, userIds }: { testId: string; userIds: number[] }) =>
            SharedService.updateTestAccess(testId, { user_ids: userIds }),
        {
            onMutate: ({ testId }) => {
                setUsersUpdating((prev) => ({ ...prev, [testId]: true }));
            },
            onSettled: (_data, _error, variables) => {
                setUsersUpdating((prev) => {
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
            ? getErrorMessage(
                  groupsQuery.error,
                  "Не удалось загрузить группы",
              )
            : null,
        groupsRefetch: groupsQuery.refetch,
        updateTestAccessStatus: (testId: string, status: TestsAccessStatus) =>
            updateStatusMutation
                .mutateAsync({ testId, status })
                .then((resp) => resp.test),
        statusUpdating,
        updateTestAccessUsers: (testId: string, userIds: number[]) =>
            updateUsersMutation
                .mutateAsync({ testId, userIds })
                .then((resp) => resp.test),
        usersUpdating,
    };
};
