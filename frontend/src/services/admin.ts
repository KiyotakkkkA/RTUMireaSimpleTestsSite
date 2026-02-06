import { api } from "../configs/api";

import type { User } from "../types/User";
import type {
    AdminAuditFilters,
    AdminAuditResponse,
} from "../types/admin/AdminAudit";
import type {
    AdminCreateUserPayload,
    AdminPermissionsResponse,
    AdminRolesResponse,
    AdminUsersFilters,
    AdminUsersResponse,
} from "../types/admin/AdminUsers";

export const AdminService = {
    getUsers: async (
        filters: AdminUsersFilters = {},
    ): Promise<AdminUsersResponse> => {
        const { data } = await api.get<AdminUsersResponse>("/admin/users", {
            params: filters,
        });
        return data;
    },

    getRoles: async (): Promise<AdminRolesResponse> => {
        const { data } = await api.get<AdminRolesResponse>("/admin/roles");
        return data;
    },

    getPermissions: async (): Promise<AdminPermissionsResponse> => {
        const { data } =
            await api.get<AdminPermissionsResponse>("/admin/permissions");
        return data;
    },

    updateUserRoles: async (userId: number, roles: string[]): Promise<User> => {
        const { data } = await api.patch<{ user: User }>(
            `/admin/users/${userId}/roles`,
            { roles },
        );
        return data.user;
    },

    updateUserPermissions: async (
        userId: number,
        perms: string[],
    ): Promise<User> => {
        const { data } = await api.patch<{ user: User }>(
            `/admin/users/${userId}/permissions`,
            { perms },
        );
        return data.user;
    },

    createUser: async (payload: AdminCreateUserPayload): Promise<User> => {
        const { data } = await api.post<{ user: User }>(
            "/admin/users",
            payload,
        );
        return data.user;
    },

    deleteUser: async (userId: number): Promise<void> => {
        await api.delete(`/admin/users/${userId}`);
    },

    getAudit: async (
        filters: AdminAuditFilters = {},
    ): Promise<AdminAuditResponse> => {
        const { data } = await api.get<AdminAuditResponse>("/admin/audit", {
            params: filters,
        });
        return data;
    },

    downloadAuditPdf: async (
        filters: AdminAuditFilters = {},
    ): Promise<void> => {
        const { data, headers } = await api.get("/download/admin/audit/pdf", {
            params: filters,
            responseType: "blob",
        });

        const blob = new Blob([data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const disposition = headers?.["content-disposition"] as
            | string
            | undefined;
        const match = disposition?.match(/filename="?([^";]+)"?/i);
        link.href = url;
        link.download = match?.[1] ?? "audit.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};
