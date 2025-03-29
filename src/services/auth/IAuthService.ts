import { LoginResponse } from "@/features/auth/models/LoginResponse";
import { LoginRequest } from "@/features/auth/models/LoginRequest";
import { RefreshTokenResponse } from "@/features/auth/models/RefreshTokenResponse";
import { IDataResult } from "@/utilities/results/IDataResult";
import { IResult } from "@/utilities/results/IResult";

export interface IAuthService {
    loginAsync(request: LoginRequest): Promise<IDataResult<LoginResponse>>;
    logoutAsync(): Promise<IResult>;
    refreshtokenAsync(): Promise<IResult>;
    isAuthenticated(): boolean

}