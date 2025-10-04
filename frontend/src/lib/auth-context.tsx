import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Entity, currentUser as mockCurrentUser, entities } from './mock-data';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
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

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Sprawdź twardy użytkownik
    if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
      const loggedInUser: User = {
        id: HARDCODED_USER.id,
        name: HARDCODED_USER.name,
        email: HARDCODED_USER.email,
        role: HARDCODED_USER.role as any,
        active: HARDCODED_USER.active,
        createdAt: HARDCODED_USER.createdAt,
      };
      setUser(loggedInUser);
      sessionStorage.setItem('uknf_current_user', JSON.stringify(loggedInUser));
      return;
    }

    // Sprawdź zarejestrowanych użytkowników
    const users = getStoredUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const loggedInUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role as any,
        active: foundUser.active,
        createdAt: foundUser.createdAt,
      };
      setUser(loggedInUser);
      sessionStorage.setItem('uknf_current_user', JSON.stringify(loggedInUser));
    } else {
      throw new Error('Nieprawidłowy login lub hasło');
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
