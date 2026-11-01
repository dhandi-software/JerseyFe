import axios from "axios";

export const normalizeBaseUrl = (rawUrl?: string): string => {
    const trimmed = (rawUrl || "").trim().replace(/\/$/, "");
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("/")) return trimmed;
    if (trimmed.startsWith("localhost") || trimmed.startsWith("127.0.0.1")) {
        return `http://${trimmed}`;
    }
    return `https://${trimmed}`;
};

export const getEnvUrl = (): string => {
    if (typeof window === "undefined" && typeof process !== "undefined") {
        if (process?.env?.INTERNAL_API_URL) {
            return normalizeBaseUrl(process.env.INTERNAL_API_URL);
        }
        if (process?.env?.VITE_API_BASE_URL) {
            return normalizeBaseUrl(process.env.VITE_API_BASE_URL);
        }
    }
    if (typeof window !== "undefined" && (window as any).__API_BASE_URL__) {
        return normalizeBaseUrl((window as any).__API_BASE_URL__);
    }
    return normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || "");
};

const envUrl = getEnvUrl();
const baseUrl = envUrl.replace(/\/$/, "");

export const API_URL = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;
export const UPLOADS_URL = baseUrl || "";

export const getUploadsUrl = (): string => {
    const currentBase = getEnvUrl().replace(/\/$/, "");
    return currentBase.endsWith("/api") ? currentBase.slice(0, -4) : currentBase;
};

export const client = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

client.interceptors.request.use((config) => {
    const runtimeBase = getEnvUrl().replace(/\/$/, "");
    if (runtimeBase) {
        config.baseURL = runtimeBase.endsWith("/api") ? runtimeBase : `${runtimeBase}/api`;
    }

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
