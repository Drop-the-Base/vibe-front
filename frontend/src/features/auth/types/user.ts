export type UserRole = 'admin' | 'internal' | 'external_admin' | 'external_user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  entity?: string;
  entityId?: string;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
}
