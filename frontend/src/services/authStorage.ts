import type { User } from '../types/User';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export const AuthStorage = {
  getToken: (): string | null => {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  },

  setToken: (token: string | null): void => {
    if (!token) {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      return;
    }
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  getUser: (): User | null => {
    const raw = sessionStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setUser: (user: User | null): void => {
    if (!user) {
      sessionStorage.removeItem(AUTH_USER_KEY);
      return;
    }
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  clear: (): void => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
  },
};
