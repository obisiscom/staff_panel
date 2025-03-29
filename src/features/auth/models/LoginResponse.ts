import { AccessToken } from "./AccessToken";

export interface LoginResponse {
    accessToken: AccessToken;
    refreshToken: string;
    refreshTokenExpirationDate: string;
    requiredAuthenticationType: string | null;
}