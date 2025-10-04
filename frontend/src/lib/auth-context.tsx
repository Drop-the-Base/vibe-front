import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Entity, UserRole, entities } from './mock-data';

const API_BASE_URL = (import.meta as any)?.env?.VITE_API_URL ?? 'http://localhost:8080';

interface BackendUserDetails {
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

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  currentEntity: Entity | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  switchEntity: (entityId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Twardy użytkownik
const HARDCODED_USER: StoredUser = {
  id: 'hardcoded-1',
  name: 'Jan Kowalski',
  email: 'kowalski',
  password: 'kowalski',
  role: 'internal',
  active: true,
  createdAt: new Date().toISOString(),
};

// Funkcje do zarządzania użytkownikami w localStorage
const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('uknf_users');
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users: StoredUser[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('uknf_users', JSON.stringify(users));
};

const DEFAULT_LOGIN_ERROR = 'Nieprawidłowy login lub hasło';

const ROLE_NAME_MAP: Record<string, UserRole> = {
  ADMIN: 'admin',
  INTERNAL: 'internal',
  INTERNAL_USER: 'internal',
  EXTERNAL_ADMIN: 'external_admin',
  EXTERNAL_USER: 'external_user',
};

const mapRoleNameToUserRole = (roleName?: string): UserRole => {
  if (!roleName) {
    return 'internal';
  }

  const normalized = roleName.trim().toUpperCase().replace(/\s+/g, '_');
  return ROLE_NAME_MAP[normalized] ?? 'internal';
};

const mapStatusToActive = (status?: string): boolean => {
  if (!status) {
    return true;
  }

  const normalized = status.trim().toLowerCase();
  return normalized === 'active' || normalized === 'aktywny';
};

const mapBackendUserToUser = (details: BackendUserDetails, fallbackEmail: string): User => {
  return {
    id: details.id !== undefined && details.id !== null ? String(details.id) : `user-${Date.now()}`,
    name: details.fullName?.trim() || details.email || fallbackEmail,
    email: details.email || fallbackEmail,
    role: mapRoleNameToUserRole(details.roleName),
    entity: details.organization || undefined,
    active: mapStatusToActive(details.status),
    lastLogin: details.lastLogin ?? undefined,
    createdAt: details.createdAt ?? new Date().toISOString(),
  };
};

const mapStoredUserToUser = (stored: StoredUser): User => ({
  id: stored.id,
  name: stored.name,
  email: stored.email,
  role: stored.role,
  active: stored.active,
  createdAt: stored.createdAt,
});

const findLocalUser = (email: string, password: string): User | null => {
  if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
    return mapStoredUserToUser(HARDCODED_USER);
  }

  const users = getStoredUsers();
  const foundUser = users.find((u) => u.email === email && u.password === password);
  return foundUser ? mapStoredUserToUser(foundUser) : null;
};

const extractErrorMessage = (rawBody: string): string => {
  if (!rawBody) {
    return DEFAULT_LOGIN_ERROR;
  }

  try {
    const parsed = JSON.parse(rawBody);
    if (typeof parsed === 'string') {
      return parsed || DEFAULT_LOGIN_ERROR;
    }

    if (parsed && typeof parsed === 'object') {
      if (typeof parsed.message === 'string' && parsed.message.trim()) {
        return parsed.message;
      }
      if (typeof parsed.error === 'string' && parsed.error.trim()) {
        return parsed.error;
      }
    }
  } catch (error) {
    if (rawBody.trim()) {
      return rawBody;
    }
  }

  return DEFAULT_LOGIN_ERROR;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);

  // Sprawdź czy jest zalogowany użytkownik w sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('uknf_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const persistUserSession = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    sessionStorage.setItem('uknf_current_user', JSON.stringify(authenticatedUser));
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const rawBody = await response.text();

      if (!response.ok) {
        throw new Error(extractErrorMessage(rawBody));
      }

      let backendUser: BackendUserDetails = {};

      if (rawBody) {
        try {
          backendUser = JSON.parse(rawBody) as BackendUserDetails;
        } catch (parseError) {
          throw new Error('Nieprawidłowy format odpowiedzi serwera');
        }
      }

      const authenticatedUser = mapBackendUserToUser(backendUser, email);
      persistUserSession(authenticatedUser);
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        const fallbackUser = findLocalUser(email, password);

        if (fallbackUser) {
          persistUserSession(fallbackUser);
          return;
        }

        throw new Error('Nie można połączyć się z serwerem uwierzytelniającym');
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(DEFAULT_LOGIN_ERROR);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getStoredUsers();
    
    // Sprawdź czy użytkownik już istnieje
    if (users.some(u => u.email === email)) {
      throw new Error('Użytkownik o tym adresie email już istnieje');
    }

    // Dodaj nowego użytkownika
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: 'external_user',
      active: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);
  };

  const logout = () => {
    setUser(null);
    setCurrentEntity(null);
    sessionStorage.removeItem('uknf_current_user');
  };

  const switchEntity = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (entity) {
      setCurrentEntity(entity);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentEntity,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        switchEntity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
