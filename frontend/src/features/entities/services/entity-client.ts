import { apiClient } from '../../../shared/api/api-client';
import type { EntityDto, EntityPayload } from '../types/entity';

export const entityClient = {
  list: () => apiClient.get<EntityDto[]>('/entities'),
  get: (id: string | number) => apiClient.get<EntityDto>(`/entities/${id}`),
  create: (payload: EntityPayload) => apiClient.post<EntityDto>('/entities', payload),
  update: (id: string | number, payload: EntityPayload) =>
    apiClient.put<EntityDto>(`/entities/${id}`, payload),
  remove: (id: string | number) => apiClient.delete<void>(`/entities/${id}`),
};
