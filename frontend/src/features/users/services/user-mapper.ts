import type { UserDto, User, UserPayload } from '../types/user';

const stringValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return String(value);
};

const booleanValue = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'tak'].includes(normalized)) return true;
    if (['false', '0', 'no', 'nie'].includes(normalized)) return false;
  }
  return false;
};

export const mapUserDtoToUser = (dto: UserDto): User => {
  // determine identifier: prefer explicit id, fall back to HAL self link
  const rawId = dto.id ?? dto._links?.self?.href ?? '';
  let identifier = '';
  if (rawId) {
    // if rawId looks like a URL, take last path segment
    try {
      const url = new URL(String(rawId));
      const parts = url.pathname.split('/').filter(Boolean);
      identifier = parts.length ? parts[parts.length - 1] : String(rawId);
    } catch (e) {
      // not a full URL, use as-is
      const parts = String(rawId).split('/').filter(Boolean);
      identifier = parts.length ? parts[parts.length - 1] : String(rawId);
    }
  }

  const roleName = typeof dto.role === 'string' ? dto.role : dto.role?.name ?? '';

  return {
    id: identifier,
    userId: identifier,
    name: stringValue(dto.fullName ?? dto.name),
    email: stringValue(dto.email),
    entity: stringValue(dto.organization ?? ''),
    role: stringValue(roleName),
  // backend returns status like 'active'/'inactive' — treat 'active' explicitly
  active: (typeof dto.status === 'string') ? String(dto.status).toLowerCase() === 'active' : booleanValue(dto.status ?? false),
    lastLogin: dto.lastLogin ?? null,
    createdAt: dto.createdAt ?? null,
  };
};

export const mapUserToPayload = (u: UserPayload): UserPayload => ({
  fullName: u.fullName?.trim() || null,
  email: u.email?.trim() || null,
  organization: u.organization?.trim() || null,
  role: u.role?.trim() || null,
  status: u.status ?? 'active',
});