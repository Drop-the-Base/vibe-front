import { apiClient } from '../../../shared/api/api-client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserDetailsDto {
  id?: number | string;
  fullName?: string;
  email?: string;
  organization?: string;
  status?: string;
  roleName?: string;
  permissions?: string[];
  lastLogin?: string;
  createdAt?: string;
}

export const authClient = {
  login: (payload: LoginRequest) =>
    apiClient.post<UserDetailsDto>('/auth/login', payload),
};
