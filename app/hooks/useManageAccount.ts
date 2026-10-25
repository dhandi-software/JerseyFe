import { useState, useEffect, useCallback } from "react";
import { userApi } from "~/api/userApi";
import type { UserAccount } from "~/api/types";
import type { UseManageAccountReturn } from "~/types";

export const useManageAccount = (): UseManageAccountReturn => {
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            let response;
            if (roleFilter) {
                response = await userApi.getUsersByRole(roleFilter.toLowerCase());
            } else {
                response = await userApi.getAllUsers();
            }

            const userData = response?.data || [];
            setUsers(userData);
            setFilteredUsers(userData);
        } catch (err: any) {
            setError(err.message || "Failed to fetch users");
            console.error("Fetch users failed:", err);
        } finally {
            setIsLoading(false);
        }
    }, [roleFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredUsers(users);
            return;
        }

        const lowerQuery = searchQuery.toLowerCase();
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(lowerQuery) ||
                user.email.toLowerCase().includes(lowerQuery) ||
                (user.username && user.username.toLowerCase().includes(lowerQuery)),
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const clearSearch = () => {
        setSearchQuery("");
    };

    const handleRoleFilterChange = (role: string | null) => {
        setRoleFilter(role);
    };

    const getUserById = async (id: string) => {
        try {
            const response = await userApi.getUserById(id);
            return response.data;
        } catch (err: any) {
            console.error("Get user details failed:", err);
            return null;
        }
    };

    const updateUserRole = async (id: string, newRole: string) => {
        try {
            await userApi.updateUserRole(id, newRole.toLowerCase());
            fetchUsers();
            return true;
        } catch (err: any) {
            console.error("Update role failed:", err);
            throw err;
        }
    };

    const deleteAccount = async (id: string) => {
        try {
            await userApi.deleteUser(id);
            fetchUsers();
            return true;
        } catch (err: any) {
            console.error("Delete account failed:", err);
            throw err;
        }
    };

    return {
        users,
        filteredUsers,
        searchQuery,
        roleFilter,
        isLoading,
        error,
        handleSearchChange,
        clearSearch,
        handleRoleFilterChange,
        getUserById,
        updateUserRole,
        deleteAccount,
        refreshUsers: fetchUsers,
    };
};
