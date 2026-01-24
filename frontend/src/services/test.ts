import { api } from './api';

import type {
  TestCreationPayload,
  TestCreationResult,
  TestDetailsResponse,
  TestUpdatePayload,
} from '../types/editing/TestManagement';
import type { TestListResponse } from '../types/TestList';
import type { PublicTestResponse } from '../types/Test';

export const TestService = {
  createBlankTest: async (payload: TestCreationPayload): Promise<TestCreationResult> => {
    const response = await api.post('/workbench/tests', payload);
    return response.data;
  },
  getTestById: async (testId: string): Promise<TestDetailsResponse> => {
    const response = await api.get(`/workbench/tests/${testId}`);
    return response.data;
  },
  updateTest: async (testId: string, payload: TestUpdatePayload): Promise<TestDetailsResponse> => {
    const response = await api.put(`/workbench/tests/${testId}`, payload);
    return response.data;
  },
  deleteTest: async (testId: string): Promise<void> => {
    const response = await api.delete(`/workbench/tests/${testId}`);
    return response.data;
  },
  getTestsList: async (
    sortBy: string = 'title',
    sortDir: string = 'asc',
    page: number = 1,
    perPage: number = 10
  ): Promise<TestListResponse> => {
    const response = await api.get('/tests', {
      params: {
        sort_by: sortBy,
        sort_dir: sortDir,
        page,
        per_page: perPage,
      },
    });
    return response.data;
  },
  getPublicTestById: async (testId: string): Promise<PublicTestResponse> => {
    const response = await api.get(`/tests/${testId}`);
    return response.data;
  },
};
