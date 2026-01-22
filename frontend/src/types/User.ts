export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    roles: string[];
    perms: string[];
    created_at?: string;
    updated_at?: string;
};
