'use client';

import { RoleProvider } from '@/context/RoleContext';
import RoleSwitcher from '@/components/dashboard/RoleSwitcher';
import type { ReactNode } from 'react';

export function DashboardClientWrapper({ 
  children, 
  orgName, 
  tenantId, 
  accentColor 
}: { 
  children: ReactNode; 
  orgName: string; 
  tenantId: string | null;
  accentColor?: string;
}) {
  return (
    <RoleProvider initialRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-xl font-semibold text-gray-900">
                  {orgName}
                </div>
                <div className="text-sm text-gray-600">
                  {tenantId ? `Tenant: ${tenantId}` : 'No tenant detected'}
                </div>
              </div>
              {accentColor && (
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </div>

            <RoleSwitcher />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </RoleProvider>
  );
}
