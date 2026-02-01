import { api } from "../configs/api";
import type { User } from "../types/User";

export type AuthResponse = {
    user: User;
    token: string;
    token_type: string;
};

export type RegisterResponse = {
    user: User;
    verify_token: string;
};

export type AuthMeResponse = {
    user: User;
};

export type LoginPayload = {
    email: string;
    password: string;
    rememberMe: boolean;
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type VerifyPayload = {
    verify_token: string;
    code: string;
};

export const AuthService = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>("/auth/login", payload);
        return data;
    },

    register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
        const { data } = await api.post<RegisterResponse>(
            "/auth/register",
            payload,
        );
        return data;
    },

    verify: async (payload: VerifyPayload): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>("/auth/verify", payload);
        return data;
    },

    me: async (): Promise<AuthMeResponse> => {
        const { data } = await api.get<AuthMeResponse>("/auth/me");
        return data;
    },

    logout: async (): Promise<void> => {
        await api.post("/auth/logout");
    },
};
