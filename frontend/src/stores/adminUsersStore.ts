import { makeAutoObservable, runInAction } from 'mobx';

import { AdminService } from '../services/admin';

import type { User } from '../types/User';
import type {
  AdminPermissionsResponse,
  AdminRolesResponse,
  AdminUsersFilters,
  AdminUsersPagination,
} from '../types/admin/AdminUsers';

const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message || error?.message || fallback;

const isShallowEqual = (a: Record<string, any>, b: Record<string, any>) =>
    Object.keys(a).every((key) => a[key] === b[key]);

export class AdminUsersStore {
    users: User[] = [];
    roles: AdminRolesResponse['roles'] = [];
    permissions: AdminPermissionsResponse['permissions'] = {};
    usersPagination: AdminUsersPagination = {
        page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    };
    usersFilters: AdminUsersFilters = {
        search: '',
        role: '',
        permissions: [],
        page: 1,
        per_page: 10,
    };
    usersLoading = false;
    usersAdding = false;
    usersError: string | null = null;
    usersDeletingIds: Record<number, boolean> = {};

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    get usersAppliedFilters(): AdminUsersFilters {
        return {
            search: this.usersFilters.search || undefined,
            role: this.usersFilters.role || undefined,
            permissions:
                this.usersFilters.permissions && this.usersFilters.permissions.length
                ? this.usersFilters.permissions
                : undefined,
            page: this.usersFilters.page,
            per_page: this.usersFilters.per_page,
        };
    }

    updateUsersFilters(next: Partial<AdminUsersFilters>): void {
        const updated = { ...this.usersFilters, ...next };
        const shouldResetPage = Object.keys(next).some((key) => key !== 'page' && key !== 'per_page');
        if (shouldResetPage) updated.page = 1;
        if (isShallowEqual(updated as Record<string, any>, this.usersFilters as Record<string, any>)) return;
        this.usersFilters = updated;
    }

    async loadUsers(): Promise<void> {
        try {
            this.usersLoading = true;
            this.usersError = null;
            const [usersResp, rolesResp, permsResp] = await Promise.all([
                AdminService.getUsers(this.usersAppliedFilters),
                AdminService.getRoles(),
                AdminService.getPermissions(),
            ]);
            runInAction(() => {
                this.users = usersResp.data;
                this.usersPagination = usersResp.pagination;
                this.roles = rolesResp.roles;
                this.permissions = permsResp.permissions;
            });
        } catch (e: any) {
            runInAction(() => {
                this.usersError = getErrorMessage(e, 'Ошибка загрузки данных');
            });
        } finally {
            runInAction(() => {
                this.usersLoading = false;
            });
        }
    }

    async createUser(payload: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        role?: string;
    }): Promise<User> {
        this.usersAdding = true;
        try {
            const created = await AdminService.createUser(payload);
            runInAction(() => {
                this.users = [created, ...this.users];
            });
            return created;
        } catch (e: any) {
            runInAction(() => {
                this.usersError = getErrorMessage(e, 'Не удалось создать пользователя');
            });
            throw e;
        } finally {
            runInAction(() => {
                this.usersAdding = false;
            });
        }
    }

    async updateUserRoles(userId: number, nextRoles: string[]): Promise<User> {
        try {
            const updated = await AdminService.updateUserRoles(userId, nextRoles);
            runInAction(() => {
                this.users = this.users.map((u) => (u.id === updated.id ? updated : u));
            });
            return updated;
        } catch (e: any) {
            runInAction(() => {
                this.usersError = getErrorMessage(e, 'Не удалось сохранить роли');
            });
            throw e;
        }
    }

    async updateUserPermissions(userId: number, nextPerms: string[]): Promise<User> {
        try {
            const updated = await AdminService.updateUserPermissions(userId, nextPerms);
            runInAction(() => {
                this.users = this.users.map((u) => (u.id === updated.id ? updated : u));
            });
            return updated;
        } catch (e: any) {
            runInAction(() => {
                this.usersError = getErrorMessage(e, 'Не удалось сохранить права');
            });
            throw e;
        }
    }

    async deleteUser(userId: number): Promise<void> {
        this.usersDeletingIds = { ...this.usersDeletingIds, [userId]: true };
        try {
            await AdminService.deleteUser(userId);
            runInAction(() => {
                this.users = this.users.filter((u) => u.id !== userId);
            });
        } catch (e: any) {
            runInAction(() => {
                this.usersError = getErrorMessage(e, 'Не удалось удалить пользователя');
            });
            throw e;
        } finally {
            runInAction(() => {
                const next = { ...this.usersDeletingIds };
                delete next[userId];
                this.usersDeletingIds = next;
            });
        }
    }
}

export const adminUsersStore = new AdminUsersStore();
