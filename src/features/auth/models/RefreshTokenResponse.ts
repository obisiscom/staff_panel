import { AccessToken } from "@/types/auth";

export interface RefreshTokenResponse {
    accessToken: AccessToken;
    refreshToken: string;
    refreshTokenExpirationDate: string;
}