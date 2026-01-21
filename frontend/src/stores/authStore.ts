import { makeAutoObservable, runInAction } from 'mobx';

import { AuthStorage } from '../services/authStorage';
import { AuthService } from '../services/auth';

import type { User } from '../types/User';

export class AuthStore {
  user: User | null = AuthStorage.getUser();
  token: string | null = AuthStorage.getToken();
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isAuthorized(): boolean {
    return Boolean(this.token);
  }

  private setSession(user: User, token: string): void {
    this.user = user;
    this.token = token;
    AuthStorage.setUser(user);
    AuthStorage.setToken(token);
  }

  private clearSession(): void {
    this.user = null;
    this.token = null;
    this.error = null;
    AuthStorage.clear();
  }

  async init(): Promise<void> {
    if (!this.token) return;
    try {
      this.isLoading = true;
      const data = await AuthService.me();
      runInAction(() => {
        this.user = data.user;
        AuthStorage.setUser(data.user);
      });
    } catch {
      runInAction(() => {
        this.clearSession();
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      this.isLoading = true;
      this.error = null;
      const data = await AuthService.login({ email, password });
      runInAction(() => {
        this.setSession(data.user, data.token);
      });
      return true;
    } catch (error: any) {
      runInAction(() => {
        this.error = error?.response?.data?.message || 'Ошибка авторизации';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async register(name: string, email: string, password: string, password_confirmation: string): Promise<boolean> {
    try {
      this.isLoading = true;
      this.error = null;
      const data = await AuthService.register({
        name,
        email,
        password,
        password_confirmation,
      });
      runInAction(() => {
        this.setSession(data.user, data.token);
      });
      return true;
    } catch (error: any) {
      runInAction(() => {
        console.log(error);
        this.error = error?.response?.data?.message || 'Ошибка регистрации';
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async logout(): Promise<void> {
    try {
      await AuthService.logout();
    } finally {
      runInAction(() => {
        this.clearSession();
      });
    }
  }
}

export const authStore = new AuthStore();
