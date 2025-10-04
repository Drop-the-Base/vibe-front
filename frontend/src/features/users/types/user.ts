export type UserStatus = 'active' | 'inactive' | string;

export interface UserDto {
  id?: number | string;
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
  organization?: string | null;
  role?: { name?: string } | string | null;
  status?: UserStatus | null;
  lastLogin?: string | null;
  createdAt?: string | null;
  _links?: {
    self?: { href?: string };
    [key: string]: any;
  } | null;
}

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  entity: string;
  role: string;
  active: boolean;
  lastLogin: string | null;
  createdAt: string | null;
}

export interface UserPayload {
  // for future create/update payloads
  fullName?: string | null;
  email?: string | null;
  organization?: string | null;
  role?: string | null;
  status?: UserStatus;
}