// api/userApi.ts
import { client } from "./client";
import type {
    ChangePasswordRequest,
    ChangePasswordResponse,
    ProfileResponse,
} from "./types";

export const userApi = {
    // Change password
    changePassword: async (
        data: ChangePasswordRequest,
    ): Promise<ChangePasswordResponse> => {
        try {
            const response = await client.put<ChangePasswordResponse>(
                "/user/change-password",
                data,
            );

            return response.data;
        } catch (error: any) {
            console.error("❌ Change password error:", error);
            throw error;
        }
    },

    /**
     * Get current user profile
     */
    getCurrentProfile: async (): Promise<ProfileResponse> => {
        try {
            const response = await client.get<ProfileResponse>("/user/profile");
            return response.data;
        } catch (error: any) {
            console.error("❌ Get current profile error:", error);
            throw error;
        }
    },

    /**
     * Create Customer
     * POST /admin/create-customer
     */
    createCustomer: async (data: any): Promise<any> => {
        try {
            const response = await client.post("/admin/create-customer", data);
            return response.data;
        } catch (error: any) {
            console.error("❌ Create Customer error:", error);
            throw error;
        }
    },

    /**
     * Create Staff
     * POST /admin/create-staff
     */
    createStaff: async (data: any): Promise<any> => {
        try {
            const response = await client.post("/admin/create-staff", data);
            return response.data;
        } catch (error: any) {
            console.error("❌ Create Staff error:", error);
            throw error;
        }
    },

    /**
     * Get all users
     */
    getAllUsers: async (): Promise<any> => {
        try {
            const response = await client.get("/admin/users");
            return response.data;
        } catch (error: any) {
            console.error("❌ Get all users error:", error);
            throw error;
        }
    },

    /**
     * Get users by role
     */
    getUsersByRole: async (role: string): Promise<any> => {
        try {
            const response = await client.get(`/admin/users-role?role=${role}`);
            return response.data;
        } catch (error: any) {
            console.error("❌ Get users by role error:", error);
            throw error;
        }
    },

    /**
     * Get user by ID
     */
    getUserById: async (id: string): Promise<any> => {
        try {
            const response = await client.get(`/admin/users/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("❌ Get user by ID error:", error);
            throw error;
        }
    },

    /**
     * Update user
     */
    updateUser: async (id: string, data: any): Promise<any> => {
        try {
            const response = await client.put(`/admin/users/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error("❌ Update user error:", error);
            throw error;
        }
    },

    /**
     * Delete user
     */
    deleteUser: async (id: string, force: boolean = false): Promise<any> => {
        try {
            const url = force ? `/admin/users/${id}?force=true` : `/admin/users/${id}`;
            const response = await client.delete(url);
            return response.data;
        } catch (error: any) {
            console.error("❌ Delete user error:", error);
            throw error;
        }
    },
};
