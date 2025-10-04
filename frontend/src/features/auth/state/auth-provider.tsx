import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import type { Entity } from '../../../lib/mock-data';
import { entities } from '../../../lib/mock-data';
import { ApiError } from '../../../shared/api/api-client';
import { authClient } from '../services/auth-client';
import { findDemoUser, registerDemoUser } from '../services/demo-auth';
import { mapUserDetailsToUser } from '../services/user-mapper';
import type { User } from '../types/user';

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

const SESSION_STORAGE_KEY = 'uknf_current_user';
const DEFAULT_LOGIN_ERROR = 'Nieprawidłowy login lub hasło';

const readPersistedUser = (): User | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch (error) {
    console.warn('Unable to parse persisted user session', error);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);

  useEffect(() => {
    const persistedUser = readPersistedUser();
    if (persistedUser) {
      setUser(persistedUser);
    }
  }, []);

  const persistUserSession = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authenticatedUser));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const dto = await authClient.login({ email, password });
      const authenticatedUser = mapUserDetailsToUser(dto ?? {}, email);
      persistUserSession(authenticatedUser);
    } catch (error) {
      if (error instanceof TypeError) {
        const fallbackUser = findDemoUser(email, password);
        if (fallbackUser) {
          persistUserSession(fallbackUser);
          return;
        }
        throw new Error('Nie można połączyć się z serwerem uwierzytelniającym');
      }

      if (error instanceof ApiError) {
        throw new Error(error.message || DEFAULT_LOGIN_ERROR);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(DEFAULT_LOGIN_ERROR);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    await registerDemoUser(name, email, password);
  };

  const logout = () => {
    setUser(null);
    setCurrentEntity(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  };

  const switchEntity = (entityId: string) => {
    const entity = entities.find((item) => item.id === entityId) ?? null;
    setCurrentEntity(entity);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentEntity,
        isAuthenticated: Boolean(user),
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
