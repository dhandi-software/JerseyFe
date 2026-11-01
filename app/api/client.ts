import axios from "axios";

const getEnvUrl = () => {
    if (typeof window === "undefined" && typeof process !== "undefined" && process?.env?.INTERNAL_API_URL) {
        return process.env.INTERNAL_API_URL;
    }
    return import.meta.env.VITE_API_BASE_URL || "";
};

const envUrl = getEnvUrl();
const baseUrl = envUrl.replace(/\/$/, "");

export const API_URL = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
export const UPLOADS_URL = baseUrl || "";

export const client = axios.create({
    baseURL: API_URL,
    timeout: 3500,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

client.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }

    if (typeof window !== "undefined") {
        let token = localStorage.getItem("jwt");
        if (!token) {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    const userObj = JSON.parse(userStr);
                    token = userObj.token;
                } catch {}
            }
        }
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401 && typeof window !== "undefined") {
            const reqUrl = String(error.config?.url || "");
            if (!reqUrl.includes("/auth/login")) {
                localStorage.removeItem("jwt");
                localStorage.removeItem("user");
            }
        }
        return Promise.reject(error);
    }
);
