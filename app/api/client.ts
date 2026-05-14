import axios from "axios";

const getEnvUrl = () => {
    if (typeof window === "undefined" && typeof process !== "undefined" && process?.env?.INTERNAL_API_URL) {
        return process.env.INTERNAL_API_URL;
    }
    // Return empty by default to use the Vite proxy during local dev
    return import.meta.env.VITE_API_BASE_URL || "";
};

const envUrl = getEnvUrl();
const baseUrl = envUrl.replace(/\/$/, "");

// Use '/api' prefix as requested ("tetep yang saya punya")
export const API_URL = baseUrl.endsWith("/api") ? baseUrl : `${baseUrl}/api`;

// We also export the static uploads URL for static file links
export const UPLOADS_URL = baseUrl || "";

export const client = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor to handle FormData
client.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        // Remove default Content-Type to let Axios set it with the boundary
        delete config.headers["Content-Type"];
    }
    return config;
});

// Response interceptor to handle errors
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized (e.g., redirect to login)
            console.warn("Unauthorized request - JWT might be expired");
        }
        return Promise.reject(error);
    }
);
