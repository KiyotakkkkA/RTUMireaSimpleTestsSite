import { makeAutoObservable, runInAction } from 'mobx';

import { AdminService } from '../services/admin';

import type { AdminAuditFilters, AdminAuditPagination, AdminAuditRecord } from '../types/admin/AdminAudit';

const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message || error?.message || fallback;

const isShallowEqual = (a: Record<string, any>, b: Record<string, any>) =>
    Object.keys(a).every((key) => a[key] === b[key]);

export class AdminAuditStore {
    auditRecords: AdminAuditRecord[] = [];
    auditPagination: AdminAuditPagination = {
        page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
    };
    auditFilters: AdminAuditFilters = {
        action_type: '',
        date_from: '',
        date_to: '',
        page: 1,
        per_page: 10,
    };
    auditLoading = false;
    auditError: string | null = null;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    get auditAppliedFilters(): AdminAuditFilters {
        return {
            ...this.auditFilters,
            action_type: this.auditFilters.action_type || undefined,
            date_from: this.auditFilters.date_from || undefined,
            date_to: this.auditFilters.date_to || undefined,
        };
    }

    updateAuditFilters(next: Partial<AdminAuditFilters>): void {
        const updated = {
        ...this.auditFilters,
        ...next,
        };
        const shouldResetPage = Object.keys(next).some((key) => key !== 'page' && key !== 'per_page');
        if (shouldResetPage) updated.page = 1;
        if (isShallowEqual(updated as Record<string, any>, this.auditFilters as Record<string, any>)) return;
        this.auditFilters = updated;
    }

    async loadAudit(): Promise<void> {
        try {
            this.auditLoading = true;
            this.auditError = null;
            const response = await AdminService.getAudit(this.auditAppliedFilters);
            runInAction(() => {
                this.auditRecords = response.data;
                this.auditPagination = response.pagination;
            });
        } catch (e: any) {
            runInAction(() => {
                this.auditError = getErrorMessage(e, 'Не удалось загрузить журнал аудита');
            });
        } finally {
            runInAction(() => {
                this.auditLoading = false;
            });
        }
    }
}

export const adminAuditStore = new AdminAuditStore();
