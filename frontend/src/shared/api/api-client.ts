import { API_BASE_URL } from '../config/environment';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig extends RequestInit {
  method?: HttpMethod;
  headers?: HeadersInit;
}

const resolveUrl = (path: string) => {
  if (!path.startsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

const deriveErrorMessage = (data: unknown, fallback: string) => {
  if (typeof data === 'string') {
    return data || fallback;
  }

  if (data && typeof data === 'object') {
    if ('message' in data && typeof (data as any).message === 'string' && (data as any).message.trim()) {
      return (data as any).message;
    }
    if ('error' in data && typeof (data as any).error === 'string' && (data as any).error.trim()) {
      return (data as any).error;
    }
  }

  return fallback;
};

const parseResponseBody = async (response: Response) => {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new ApiError('Nieprawidłowy format odpowiedzi serwera', response.status, text);
    }
  }

  return text;
};

async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const url = resolveUrl(path);
  const headers = new Headers(config.headers);

  const init: RequestInit = {
    ...config,
    headers,
  };

  const response = await fetch(url, init);
  const data = await parseResponseBody(response);

  if (!response.ok) {
    const message = deriveErrorMessage(data, response.statusText || 'Wystąpił błąd podczas komunikacji z serwerem');
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

const ensureJsonHeaders = (headers?: HeadersInit) => {
  const combined = new Headers(headers);
  if (!combined.has('Content-Type')) {
    combined.set('Content-Type', 'application/json');
  }
  return combined;
};

export const apiClient = {
  get: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, {
      ...config,
      method: 'GET',
    }),
  post: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, {
      ...config,
      method: 'POST',
      headers: ensureJsonHeaders(config?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, {
      ...config,
      method: 'PUT',
      headers: ensureJsonHeaders(config?.headers),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string, config?: RequestConfig) =>
    request<T>(path, {
      ...config,
      method: 'DELETE',
    }),
};

export type ApiClient = typeof apiClient;
