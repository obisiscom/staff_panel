import { LoginResponse, UserClaims } from '@/types/auth';
import { cookies } from 'next/headers';

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

    // Refresh Token için cookie oluşturma
    cookieStore.set({
        name: 'refresh-token',
        value: authData.refreshToken,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(authData.refreshTokenExpirationDate), // API'den gelen süre kullanılıyor
        sameSite: 'strict',
    });
}

export async function removeAuthCookiesAsync() {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
    cookieStore.delete('refresh-token');
}

export async function getAuthCookieAsync() {
    const cookieStore = await cookies();
    return cookieStore.get('auth-token')?.value;
}

export async function getRefreshCookieAsync() {
    const cookieStore = await cookies();
    return cookieStore.get('refresh-token')?.value;
}

export function parseJwtClaims(token: string): UserClaims {
    try {
        // JWT'nin payload kısmını decode et
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        // Claims'leri daha kullanışlı bir formata dönüştür
        return {
            id: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
            role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        };
    } catch (error) {
        console.error('JWT parse hatası:', error);
        return { id: '', email: '', role: '' };
    }
}

// Token'ın geçerlilik süresini kontrol et
export function isTokenExpired(token: string): boolean {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        // exp değeri saniye cinsinden, Date.now() milisaniye cinsinden
        return payload.exp * 1000 < Date.now();
    } catch (error) {
        return true; // Hata durumunda token'ı geçersiz say
    }
}