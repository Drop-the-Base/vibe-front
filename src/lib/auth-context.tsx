import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Entity, currentUser as mockCurrentUser, entities } from './mock-data';

interface AuthContextType {
  user: User | null;
  currentEntity: Entity | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchEntity: (entityId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockCurrentUser);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login - w prawdziwej aplikacji byłoby to API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(mockCurrentUser);
  };

  const logout = () => {
    setUser(null);
    setCurrentEntity(null);
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
