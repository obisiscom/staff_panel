'use server'

import { getAuthCookieAsync, getRefreshCookieAsync, isTokenExpired, setAuthCookiesAsync } from './auth';

// Token yenileme işlemi
export async function refreshTokenIfNeeded(): Promise<boolean> {
    const accessToken = await getAuthCookieAsync();

    if (!accessToken) {
        return false;
    }

    // Token süresi geçmiş mi kontrol et
    if (!isTokenExpired(accessToken)) {
        return true; // Token hala geçerli, yenileme gerekmez
    }

    // Refresh token ile yeni token al
    const refreshToken = await getRefreshCookieAsync();

    if (!refreshToken) {
        return false;
    }

    try {
        const response = await fetch('https://staff.api.obisis.com/v1/Auth/RefreshToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        await setAuthCookiesAsync(data);

        return true;
    } catch (error) {
        console.error('Token yenileme hatası:', error);
        return false;
    }
}
