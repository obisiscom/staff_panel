import { IDataResult } from "@/utilities/results/IDataResult";
import { IAuthService } from "./IAuthService";
import { LoginRequest } from "../../features/auth/models/LoginRequest";
import { injectable } from "tsyringe/types/decorators";
import { LoginResponse } from "@/features/auth/models/LoginResponse";
import { loginServerActionAsync, logoutServerActionAsync, refreshTokenServerActionAsync } from "./AuthApiService";
import { ErrorDataResult } from "@/utilities/results/ErrorDataResult";
import { SuccessDataResult } from "@/utilities/results/SuccessDataResult";
import { IResult } from "@/utilities/results/IResult";
import { ErrorResult } from "@/utilities/results/ErrorResult";
import { SuccessResult } from "@/utilities/results/SuccessResult";

@injectable()
export class AuthManager implements IAuthService {
    // private _apiClient: ApiClient;

    // constructor(apiClient: ApiClient) {
    //     this._apiClient = apiClient;
    // }

    async loginAsync(request: LoginRequest): Promise<IDataResult<LoginResponse>> {
        try {
            const result = await loginServerActionAsync(request);

            if (!result.success || !result.data) {
                return new ErrorDataResult<LoginResponse>(null, result.message || 'Giriş başarısız');
            }
            return new SuccessDataResult<LoginResponse>(result.data);
        } catch (error) {
            return new ErrorDataResult<LoginResponse>(null, 'An error occured');
        }
    }

    async logoutAsync(): Promise<IResult> {
        try {
            await logoutServerActionAsync();
            return new SuccessResult();
        } catch (error) {
            return new ErrorResult(error instanceof Error ? error.message : 'Unknown error during logout');
        }
    }

    async refreshtokenAsync(): Promise<IResult> {
        try {
            const result = await refreshTokenServerActionAsync();
            if (!result.success) {
                return new ErrorResult(result.message || 'Token yenileme başarısız');
            }

            return new SuccessResult('Token başarıyla yenilendi');
        } catch (error) {
            return new ErrorResult('Token yenileme sırasında hata oluştu');
        }
    }

    isAuthenticated(): boolean {
        throw new Error("Method not implemented.");
    }


    // //#region Private Methods

    // private async setAuthCookiesAsync(authData: LoginResponse) {
    //     // Access Token için cookie oluşturma
    //     const cookieStore = await cookies();
    //     cookieStore.set({
    //         name: 'auth-token',
    //         value: authData.accessToken.token,
    //         httpOnly: true,
    //         path: '/',
    //         secure: process.env.NODE_ENV === 'production',
    //         expires: new Date(authData.accessToken.expirationDate), // API'den gelen süre kullanılıyor
    //         sameSite: 'strict',
    //     });
    // }

    // private async removeAuthCookiesAsync() {
    //     const cookieStore = await cookies();
    //     cookieStore.delete('auth-token');
    //     cookieStore.delete('refresh-token');
    // }

    // private async getAuthCookieAsync() {
    //     const cookieStore = await cookies();
    //     return cookieStore.get('auth-token')?.value;
    // }

    // private async getRefreshCookieAsync() {
    //     const cookieStore = await cookies();
    //     return cookieStore.get('refresh-token')?.value;
    // }

    // private parseJwtClaims(token: string): UserClaims {
    //     try {
    //         // JWT'nin payload kısmını decode et
    //         const base64Url = token.split('.')[1];
    //         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    //         const payload = JSON.parse(atob(base64));

    //         // Claims'leri daha kullanışlı bir formata dönüştür
    //         return {
    //             id: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    //             email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
    //             role: payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    //         };
    //     } catch (error) {
    //         console.error('JWT parse hatası:', error);
    //         return { id: '', email: '', role: '' };
    //     }
    // }

    // //#endregion

}