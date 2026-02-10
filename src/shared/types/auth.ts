export interface AuthSession {
  userId: string;
  email: string;
  role: 'superadmin' | 'admin' | 'manager' | 'staff';
  organizationId?: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SuperAdminLoginRequest {
  email: string;
  password: string;
}

export interface StaffLoginRequest {
  email: string;
  password: string;
  organizationId: string;
}

export interface LoginResponse {
  success: boolean;
  session?: AuthSession;
  error?: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
  iat: number;
  exp: number;
}
