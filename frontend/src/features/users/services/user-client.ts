import { apiClient } from '../../../shared/api/api-client';
import type { UserDto, UserPayload } from '../types/user';

export const userClient = {
  list: (params = '') => apiClient.get<UserDto[]>(`/users${params ? `?${params}` : ''}`),
  get: (id: string | number) => apiClient.get<UserDto>(`/users/${id}`),
  create: (payload: UserPayload) => apiClient.post<UserDto>('/users', payload),
  update: (id: string | number, payload: UserPayload) => apiClient.put<UserDto>(`/users/${id}`, payload),
  remove: (id: string | number) => apiClient.delete<void>(`/users/${id}`),
};