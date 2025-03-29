'use server';

import {
    setAuthCookiesAsync
    , removeAuthCookiesAsync
    , getAuthCookieAsync
    , getRefreshCookieAsync
} from "@/services/cookie/AuthCookieService";

import { LoginResponse } from "@/features/auth/models/LoginResponse";
import { LoginRequest } from "@/features/auth/models/LoginRequest";
import { IDataResult } from "@/utilities/results/IDataResult";
import { User } from "@/features/user/models/User";
import { ErrorDataResult } from "@/utilities/results/ErrorDataResult";
import { API } from "@/constants/api";
import { UserClaims } from "@/features/user/models/UserClaim";
import { SuccessDataResult } from "@/utilities/results/SuccessDataResult";
import { IResult } from "@/utilities/results/IResult";
import { SuccessResult } from "@/utilities/results/SuccessResult";
import { ErrorResult } from "@/utilities/results/ErrorResult";
import { RefreshTokenRequest } from "@/features/auth/models/RefreshTokenRequest";


export async function loginServerActionAsync(request: LoginRequest): Promise<IDataResult<LoginResponse>> {
    try {

        const response = await fetch(`${API.BASE_URL}${API.AUTH.LOGIN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
            cache: 'no-store'
        });

        if (!response.ok) {
            return new ErrorDataResult<LoginResponse>(null, `Login failed with status: ${response.status}`);
        }

        const loginResponse: LoginResponse = await response.json();

        await setAuthCookiesAsync(loginResponse);

        // const userClaims = parseJwtClaims(loginResponse.accessToken.token);

        // const user: User = {
        //     id: userClaims.id,
        //     email: userClaims.email,
        //     firstName: '',
        //     lastName: '',
        //     role: userClaims.role
        // };

        return new SuccessDataResult<LoginResponse>(loginResponse);
    } catch (error) {
        return new ErrorDataResult<LoginResponse>(null, 'An error occured');
    }
}

export async function logoutServerActionAsync(): Promise<IResult> {
    try {
        await removeAuthCookiesAsync();
        return new SuccessResult();
    } catch (error) {
        return new ErrorResult(error instanceof Error ? error.message : 'Unknown error during logout');
    }
}

export async function refreshTokenServerActionAsync(): Promise<IResult> {
    try {
        const refreshToken = await getRefreshCookieAsync();

        if (!refreshToken) {
            return new ErrorResult('Refresh token not found');
        }

        const refreshTokenRequest: RefreshTokenRequest = {
            refreshToken
        };

        const response = await fetch(`${API.BASE_URL}${API.AUTH.REFRESHTOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(refreshTokenRequest),
            cache: 'no-store'
        });

        if (!response.ok) {
            return new ErrorResult('Token refresh failed');
        }

        const tokenResponse: LoginResponse = await response.json();
        await setAuthCookiesAsync(tokenResponse);

        return new SuccessResult('Token refreshed successfully');
    } catch (error) {
        console.error('Refresh token error:', error);
        return new ErrorResult('Error refreshing token');
    }
}

export async function getCurrentUserServerActionAsync(): Promise<IDataResult<User>> {
    try {
        // Önce token geçerliliğini kontrol et, gerekirse yenile
        const token = await getAuthCookieAsync();

        if (!token) {
            return new ErrorDataResult<User>(null, 'No authentication token found');
        }

        if (isTokenExpired(token)) {
            const refreshResult = await refreshTokenServerActionAsync();
            if (!refreshResult.success) {
                return new ErrorDataResult<User>(null, 'Session expired');
            }
        }
        const parseToken = parseJwtClaims(token);

        // API'ye istek gönder (token cookies ile otomatik gönderilecek)
        const response = await fetch(`${API.BASE_URL}${API.USER.USER}/${parseToken.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await getAuthCookieAsync()}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return new ErrorDataResult<User>(null, 'Failed to get user information');
        }

        const userData = await response.json();
        return new SuccessDataResult<User>(userData, 'User information retrieved successfully');
    } catch (error) {
        console.error('Get current user error:', error);
        return new ErrorDataResult<User>(null, 'Error getting user information');
    }
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