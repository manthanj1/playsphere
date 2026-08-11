import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:3001';

export function buildUrl(endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}

export function getAuthToken(): string | undefined {
  return Cookies.get('token');
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}, requireAuth = false): Promise<T> {
  const url = buildUrl(endpoint);
  
  const headers = new Headers(options.headers || {});
  
  // Only set application/json if it's not FormData and not already set
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, { ...options, headers });
  
  const contentType = response.headers.get('content-type') || '';
  let data: any = null;
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    // Some routes might return 401 with standard data.error
    const message = data?.error || data?.message || `HTTP error ${response.status}`;
    const error = new ApiError(response.status, message, data);
    throw error;
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }, true),
  getPublic: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }, false),
  
  post: <T>(endpoint: string, body?: any, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    }, true);
  },
  postPublic: <T>(endpoint: string, body?: any, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    }, false);
  },
  
  put: <T>(endpoint: string, body?: any, options?: RequestInit) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    }, true);
  },
  
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }, true),
};
