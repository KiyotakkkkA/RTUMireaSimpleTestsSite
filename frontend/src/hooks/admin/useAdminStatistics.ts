import { useCallback, useEffect, useMemo, useState } from 'react';

import { AdminService } from '../../services/admin';

import type { AdminStatisticsFilters, AdminStatisticsResponse } from '../../types/admin/AdminStatistics';

const DEFAULT_FILTERS: AdminStatisticsFilters = {
  date_from: '',
  date_to: '',
  min_percentage: '',
};

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || error?.message || fallback;

export const useAdminStatistics = (initialFilters?: AdminStatisticsFilters) => {
  const [data, setData] = useState<AdminStatisticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminStatisticsFilters>(() => ({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  }));

  const appliedFilters = useMemo(() => ({
    date_from: filters.date_from || undefined,
    date_to: filters.date_to || undefined,
    min_percentage: filters.min_percentage === '' ? undefined : filters.min_percentage,
  }), [filters]);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AdminService.getStatistics(appliedFilters);
      setData(response);
    } catch (e: any) {
      setError(getErrorMessage(e, 'Не удалось загрузить статистику'));
    } finally {
      setIsLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilters = (next: Partial<AdminStatisticsFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...next,
    }));
  };

  return {
    data,
    isLoading,
    error,
    filters,
    reload: load,
    updateFilters,
  };
};
