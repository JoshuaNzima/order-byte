import type { Organization, Menu, MenuItem } from './menu';

export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationRequest {
  id: string;
  name: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  contact: {
    phone?: string;
    website?: string;
  };
  settings?: OrganizationSettings;
}

export interface OrganizationSettings {
  currency: 'MWK' | 'USD' | 'EUR' | 'GBP';
  taxRate: number;
  serviceCharge: number;
  allowTips: boolean;
  requireTableNumber: boolean;
  enableOnlinePayment: boolean;
  qrCodeExpiryMinutes: number;
}

export interface SuperAdminDashboardStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrganizations: Organization[];
}

export interface AuditLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'settings_change';
  entityType: 'organization' | 'menu' | 'user';
  entityId: string;
  performedBy: string;
  performedAt: Date;
  details: Record<string, unknown>;
}

// Extended Organization with settings for super admin
export interface OrganizationWithSettings extends Organization {
  settings: OrganizationSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  stats?: {
    totalOrders: number;
    totalRevenue: number;
    activeMenus: number;
  };
}
