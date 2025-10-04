import { User, UserRole } from '../types/user';
import { UserDetailsDto } from './auth-client';

const ROLE_NAME_MAP: Record<string, UserRole> = {
  ADMIN: 'admin',
  INTERNAL: 'internal',
  INTERNAL_USER: 'internal',
  EXTERNAL_ADMIN: 'external_admin',
  EXTERNAL_USER: 'external_user',
};

const normalizeRoleKey = (value?: string) =>
  value ? value.trim().toUpperCase().replace(/\s+/g, '_') : '';

export const mapRoleNameToUserRole = (roleName?: string): UserRole => {
  const normalized = normalizeRoleKey(roleName);
  return ROLE_NAME_MAP[normalized] ?? 'internal';
};

export const mapStatusToActive = (status?: string): boolean => {
  if (!status) {
    return true;
  }

  const normalized = status.trim().toLowerCase();
  return normalized === 'active' || normalized === 'aktywny';
};

export const mapUserDetailsToUser = (
  details: UserDetailsDto,
  fallbackEmail: string,
): User => ({
  id: details.id !== undefined && details.id !== null ? String(details.id) : `user-${Date.now()}`,
  name: details.fullName?.trim() || details.email || fallbackEmail,
  email: details.email || fallbackEmail,
  role: mapRoleNameToUserRole(details.roleName),
  entity: details.organization || undefined,
  active: mapStatusToActive(details.status),
  lastLogin: details.lastLogin,
  createdAt: details.createdAt ?? new Date().toISOString(),
});
