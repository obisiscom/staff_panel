import {container} from 'tsyringe';
import { IAuthService } from '@/services/auth/IAuthService';
import { AuthManager } from '@/services/auth/AuthManager';  


container.registerSingleton<IAuthService>('AuthService', AuthManager);

export {container};