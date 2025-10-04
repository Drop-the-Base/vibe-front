const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const rawApiBase = (import.meta as any)?.env?.VITE_API_URL ?? 'http://localhost:8080';

export const API_BASE_URL = normalizeBaseUrl(rawApiBase);

export const isDevelopment = (import.meta as any)?.env?.MODE === 'development';
