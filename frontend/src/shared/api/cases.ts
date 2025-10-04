import { apiClient } from './api-client';

export interface CaseDto {
  id: number;
  caseNumber: string;
  entityId: number;
  entityName: string;
  category: string | null;
  status: string;
  priority: string;
  assignedTo: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  dueAt: string | null;
}

export interface CreateCaseRequest {
  title: string;
  entityId: number;
  category?: string;
  priority?: string;
  status?: string;
  assignedTo?: string;
  description?: string;
  dueAt?: string;
}

export interface UpdateCaseRequest extends Partial<CreateCaseRequest> {
  clearDueAt?: boolean;
}

export interface UpdateCaseStatusRequest {
  status: string;
  assignedTo?: string;
  description?: string;
}

export const casesApi = {
  list: () => apiClient.get<CaseDto[]>('/cases'),
  get: (id: number) => apiClient.get<CaseDto>(`/cases/${id}`),
  create: (payload: CreateCaseRequest) => apiClient.post<CaseDto>('/cases', payload),
  update: (id: number, payload: UpdateCaseRequest) => apiClient.patch<CaseDto>(`/cases/${id}`, payload),
  updateStatus: (id: number, payload: UpdateCaseStatusRequest) =>
    apiClient.patch<CaseDto>(`/cases/${id}/status`, payload),
};
