import { Request } from 'express';
import { TokenPayload } from '../utils/jwt.utils';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

// Export JWT types for use in other files
export type { TokenPayload } from '../utils/jwt.utils';