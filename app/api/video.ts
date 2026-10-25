import { client } from "./client";

export const videoApi = {
    getVideos: async (params?: any) => {
        const response = await client.get("/videos", { params });
        return response.data;
    },
    getVideoById: async (id: string | number) => {
        const response = await client.get(`/videos/${id}`);
        return response.data;
    },
};
