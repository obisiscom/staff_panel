import { IDataResult } from "@/utilities/results/IDataResult";
import { IAuthService } from "./IAuthService";
import { LoginRequest } from "../../features/auth/models/LoginRequest";
import { RefreshTokenResponse } from "../../features/auth/models/RefreshTokenResponse";
import { injectable } from "tsyringe/types/decorators";
import { ApiClient } from "@/utilities/rest/ApiClient";
import { cookies } from "next/headers";
import { UserClaims } from "@/features/user/models/UserClaim";
import { LoginResponse } from "@/features/auth/models/LoginResponse";

@injectable()
export class AuthManager implements IAuthService{


    private apiClient :ApiClient;
    constructor(apiClient:ApiClient){
        this.apiClient = apiClient;
    }


    async login(request: LoginRequest): Promise<IDataResult<LoginResponse>> {

        var result = await this.apiClient.post<LoginResponse>("auth/login",request);

        if(result.success){

            
        }

        throw new Error("Method not implemented.");

    }
    logout(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    refreshtoken(): Promise<IDataResult<RefreshTokenResponse>> {
        throw new Error("Method not implemented.");
    }
    isAuthenticated(): boolean {
        throw new Error("Method not implemented.");
    }


    //#region Private Methods

    private async setAuthCookiesAsync(authData: LoginResponse) {
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
    }

    private async removeAuthCookiesAsync() {
        const cookieStore = await cookies();
        cookieStore.delete('auth-token');
        cookieStore.delete('refresh-token');
    }

    private async getAuthCookieAsync() {
        const cookieStore = await cookies();
        return cookieStore.get('auth-token')?.value;
    }

    private async getRefreshCookieAsync() {
        const cookieStore = await cookies();
        return cookieStore.get('refresh-token')?.value;
    }

    private parseJwtClaims(token: string): UserClaims {
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

    //#endregion

}