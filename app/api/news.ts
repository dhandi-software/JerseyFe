import { client } from "~/api/client";

export const newsApi = {
    getNews: async (params?: any) => {
        const response = await client.get("/news", { params });
        return response.data;
    },
    getNewsById: async (id: string | number) => {
        const response = await client.get(`/news/${id}`);
        return response.data;
    },
    createNews: async (data: any) => {
        const response = await client.post("/news", data);
        return response.data;
    },
    updateNews: async (id: string | number, data: any) => {
        const response = await client.put(`/news/${id}`, data);
        return response.data;
    },
    deleteNews: async (id: string | number) => {
        const response = await client.delete(`/news/${id}`);
        return response.data;
    },
    getHeadlineNews: async () => {
        const response = await client.get("/news/headline");
        return response.data;
    },
    getPublishedNews: async (params?: any) => {
        const response = await client.get("/news/published", { params });
        return response.data;
    },
    getArticleBySlug: async (slug: string) => {
        const response = await client.get(`/news/slug/${slug}`);
        return response.data;
    },
};
