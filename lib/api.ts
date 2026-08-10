// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? '';

async function parseJsonResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = data?.error || data?.message || `HTTP error ${response.status}`;
    throw new Error(message);
  }

  return data;
}

import Cookies from 'js-cookie';

export async function getAuthToken(): Promise<string> {
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('User is not authenticated. Please log in again.');
  }

  return token;
}

export function buildUrl(endpoint: string) {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  return `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers ?? {}),
  };

  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers,
  });

  return parseJsonResponse(response);
}

export async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  const response = await fetch(buildUrl(endpoint), {
    ...options,
    headers,
  });

  return parseJsonResponse(response);
}

export async function syncUser() {
  return fetchWithAuth('/api/auth/sync', { method: 'POST' });
}
