'use server'

import { cookies } from 'next/headers';
import { refreshTokenIfNeeded } from './refreshToken';

const BASE_URL = 'https://staff.api.obisis.com';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiClient(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = true, headers = {}, ...rest } = options;
  
  // Eğer kimlik doğrulama gerekiyorsa, token süresini kontrol et ve gerekirse yenile
  if (requireAuth) {
    const tokenValid = await refreshTokenIfNeeded();
    if (!tokenValid) {
      throw new Error('Authentication token is invalid or expired');
    }
  }
  
  //const requestHeaders: HeadersInit = { ...headers };

  const requestHeaders: HeadersInit = new Headers();

  
  if (requireAuth) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (token) {
      //requestHeaders['Authorization'] = `Bearer ${token}`;
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }
  
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
  });
  
  return response;
}

export async function apiGet<T>(endpoint: string, requireAuth = true): Promise<T> {
  const response = await apiClient(endpoint, { requireAuth });
  
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }
  
  return response.json();
}

export async function apiPost<T, D = any>(
  endpoint: string, 
  data: D, 
  requireAuth = true
): Promise<T> {
  const response = await apiClient(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    requireAuth,
  });
  
  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${await response.text()}`);
  }
  
  return response.json();
}
