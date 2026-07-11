import type { LoginCredentials, LoginResponse, RegisterCredentials } from "~/types/auth";
import { client } from "~/api/client";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await client.post("/auth/login", credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await client.post("/auth/logout").catch(err => console.error("Logout request failed:", err));
  },

  async register(credentials: RegisterCredentials): Promise<{ message: string; data: any }> {
    const response = await client.post("/auth/register", credentials);
    return response.data;
  },
};
