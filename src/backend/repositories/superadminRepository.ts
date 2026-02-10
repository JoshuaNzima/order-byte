import { organizations as seedOrgs, menus as seedMenus } from '@/backend/data/seed-data';
import type { Organization, Menu, MenuItem } from '@/shared/types/menu';
import type { OrganizationSettings, OrganizationWithSettings, AuditLog } from '@/shared/types/superadmin';

// Extended organizations with settings
const organizationsWithSettings: OrganizationWithSettings[] = seedOrgs.map((org) => ({
  ...org,
  settings: {
    currency: 'MWK' as const,
    taxRate: 0,
    serviceCharge: 0,
    allowTips: true,
    requireTableNumber: true,
    enableOnlinePayment: false,
    qrCodeExpiryMinutes: 60,
  },
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

const auditLogs: AuditLog[] = [];

export class OrganizationRepository {
  static getAll(): OrganizationWithSettings[] {
    return organizationsWithSettings.filter((org) => org.isActive);
  }

  static getById(id: string): OrganizationWithSettings | undefined {
    return organizationsWithSettings.find((org) => org.id === id && org.isActive);
  }

  static create(org: {
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
  }): OrganizationWithSettings {
    const newOrg: OrganizationWithSettings = {
      id: org.id,
      name: org.name,
      logo: undefined,
      theme: org.theme,
      contact: org.contact,
      settings: org.settings ?? {
        currency: 'MWK',
        taxRate: 0,
        serviceCharge: 0,
        allowTips: true,
        requireTableNumber: true,
        enableOnlinePayment: false,
        qrCodeExpiryMinutes: 60,
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    organizationsWithSettings.push(newOrg);
    return newOrg;
  }

  static update(
    id: string,
    updates: Partial<
      Omit<OrganizationWithSettings, 'id' | 'createdAt'>
    >
  ): OrganizationWithSettings | undefined {
    const index = organizationsWithSettings.findIndex((org) => org.id === id);
    if (index === -1) return undefined;

    organizationsWithSettings[index] = {
      ...organizationsWithSettings[index],
      ...updates,
      updatedAt: new Date(),
    };
    return organizationsWithSettings[index];
  }

  static delete(id: string): boolean {
    const index = organizationsWithSettings.findIndex((org) => org.id === id);
    if (index === -1) return false;

    organizationsWithSettings[index].isActive = false;
    return true;
  }

  static getStats(): {
    totalOrganizations: number;
    activeOrganizations: number;
    totalOrders: number;
    totalRevenue: number;
  } {
    return {
      totalOrganizations: organizationsWithSettings.length,
      activeOrganizations: organizationsWithSettings.filter((org) => org.isActive).length,
      totalOrders: 0,
      totalRevenue: 0,
    };
  }
}

export class AuditLogRepository {
  static getAll(): AuditLog[] {
    return auditLogs.sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime());
  }

  static create(log: Omit<AuditLog, 'id' | 'performedAt'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: `audit-${Date.now()}`,
      performedAt: new Date(),
    };
    auditLogs.push(newLog);
    return newLog;
  }
}
