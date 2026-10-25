export interface CreateAccountFormData {
    email: string;
    name: string;
    password: string;
    role: string;
}

export interface EditAccountFormData {
    email: string;
    name: string;
    password?: string;
    role: string;
    customerId?: string;
    category?: string;
    memberSince?: string;
    phone?: string;
    address?: string;
    staffId?: string;
    position?: string;
}

export type { UserAccount, UserAccountResponse, UpdateRoleRequest } from "~/api/types";

export interface UseManageAccountReturn {
    users: import("~/api/types").UserAccount[];
    filteredUsers: import("~/api/types").UserAccount[];
    searchQuery: string;
    roleFilter: string | null;
    isLoading: boolean;
    error: string | null;
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    clearSearch: () => void;
    handleRoleFilterChange: (role: string | null) => void;
    getUserById: (id: string) => Promise<any>;
    updateUserRole: (id: string, newRole: string) => Promise<boolean>;
    deleteAccount: (id: string) => Promise<boolean>;
    refreshUsers: () => Promise<void>;
}
