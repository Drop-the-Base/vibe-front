import { User, UserRole } from '../types/user';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'uknf_users';

const HARDCODED_USER: StoredUser = {
  id: 'hardcoded-1',
  name: 'Jan Kowalski',
  email: 'kowalski',
  password: 'kowalski',
  role: 'internal',
  active: true,
  createdAt: new Date().toISOString(),
};

const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as StoredUser[];
  } catch (error) {
    console.warn('Unable to parse stored users list', error);
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

const mapStoredUserToUser = (stored: StoredUser): User => ({
  id: stored.id,
  name: stored.name,
  email: stored.email,
  role: stored.role,
  active: stored.active,
  createdAt: stored.createdAt,
});

export const findDemoUser = (email: string, password: string): User | null => {
  if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
    return mapStoredUserToUser(HARDCODED_USER);
  }

  const users = getStoredUsers();
  const found = users.find((user) => user.email === email && user.password === password);
  return found ? mapStoredUserToUser(found) : null;
};

export const registerDemoUser = async (name: string, email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const users = getStoredUsers();

  if (users.some((user) => user.email === email)) {
    throw new Error('Użytkownik o tym adresie email już istnieje');
  }

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
