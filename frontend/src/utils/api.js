// Prefer env override, fall back to local dev
export const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:3000";
