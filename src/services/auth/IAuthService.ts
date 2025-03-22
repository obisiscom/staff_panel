import { LoginResponse } from "@/types/auth";
import { LoginRequest } from "../../features/auth/models/LoginRequest";
import { RefreshTokenResponse } from "../../features/auth/models/RefreshTokenResponse";
import { IDataResult } from "@/utilities/results/IDataResult";

export interface IAuthService {
    login(request: LoginRequest): Promise<IDataResult<LoginResponse>>;
    logout(): Promise<void>;
    refreshtoken(): Promise<IDataResult<RefreshTokenResponse>>;
    isAuthenticated(): boolean

}