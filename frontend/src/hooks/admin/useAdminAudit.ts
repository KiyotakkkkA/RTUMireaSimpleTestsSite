import { useCallback, useEffect } from "react";

import { adminAuditStore } from "../../stores/admin/adminAuditStore";

import type { AdminAuditFilters } from "../../types/admin/AdminAudit";

export const useAdminAudit = (initialFilters?: AdminAuditFilters) => {
    useEffect(() => {
        if (initialFilters) {
            adminAuditStore.updateAuditFilters(initialFilters);
        }
    }, [initialFilters]);

    useEffect(() => {
        adminAuditStore.loadAudit();
    }, []);

    const updateFilters = useCallback((next: Partial<AdminAuditFilters>) => {
        adminAuditStore.updateAuditFilters(next);
    }, []);

    return {
        records: adminAuditStore.auditRecords,
        pagination: adminAuditStore.auditPagination,
        isLoading: adminAuditStore.auditLoading,
        error: adminAuditStore.auditError,
        filters: adminAuditStore.auditFilters,
        reload: adminAuditStore.loadAudit,
        updateFilters,
    };
};
