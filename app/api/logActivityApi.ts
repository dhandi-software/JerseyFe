import { client } from "~/api/client";
import type { LogActivityFilterParams } from "~/types";

export const logActivityApi = {
    getLogs: async (params?: { page?: number; limit?: number }) => {
        const response = await client.get("/admin/logs", { params });
        return response.data;
    },
    getFilteredLogs: async (params?: LogActivityFilterParams) => {
        const response = await client.get("/admin/logs/filter", { params });
        return response.data;
    },
};
