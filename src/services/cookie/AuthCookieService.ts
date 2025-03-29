'use server';

import { LoginResponse } from "@/features/auth/models/LoginResponse";
import { cookies } from "next/headers";

export async function setAuthCookiesAsync(authData: LoginResponse) {
    // Access Token için cookie oluşturma
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'auth-token',
        value: authData.accessToken.token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(authData.accessToken.expirationDate), // API'den gelen süre kullanılıyor
        sameSite: 'strict',
    });

    cookieStore.set({
        name: 'refresh-token',
        value: authData.refreshToken,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(authData.refreshTokenExpirationDate),
        sameSite: 'strict',
    });
}

export async function removeAuthCookiesAsync(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    cookieStore.delete('refresh-token');
}

export async function getAuthCookieAsync(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get('auth-token')?.value;
}

export async function getRefreshCookieAsync(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get('refresh-token')?.value;
}