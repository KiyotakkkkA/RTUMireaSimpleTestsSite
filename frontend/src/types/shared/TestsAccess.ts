export type TestsAccessStatus = "all" | "auth" | "custom";

export type TestAccessUser = {
    id: number;
    name: string;
    email: string;
};

export type TestAccessGroup = {
    id: number;
    name: string;
    participants: TestAccessUser[];
    participants_count: number;
};

export type TestAccessItem = {
    id: string;
    title: string;
    total_questions: number;
    total_disabled?: number;
    access_status: TestsAccessStatus;
    access_link?: string | null;
    access_from?: string | null;
    access_to?: string | null;
    access_users: TestAccessUser[];
};

export type TestsAccessPagination = {
    page: number;
    per_page: number;
    total: number;
    last_page: number;
};

export type TestsAccessResponse = {
    data: TestAccessItem[];
    pagination: TestsAccessPagination;
};

export type TestsAccessUpdatePayload = {
    access_status?: TestsAccessStatus;
    user_ids?: number[];
    link_only?: boolean;
    access_from?: string | null;
    access_to?: string | null;
};

export type TestsAccessUsersResponse = {
    data: TestAccessUser[];
};

export type TestsAccessGroupsResponse = {
    data: TestAccessGroup[];
};

export type TestsAccessFilters = {
    sort_by?: "title";
    sort_dir?: "asc" | "desc";
    page?: number;
    per_page?: number;
};
