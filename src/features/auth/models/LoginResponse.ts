import { AccessToken } from "@/types/auth";

export interface LoginResponse {
    accessToken: AccessToken;
    refreshToken: string;
    refreshTokenExpirationDate: string;
    requiredAuthenticationType: string | null;
}