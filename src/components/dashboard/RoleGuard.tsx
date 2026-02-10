'use client';

import { useRole, type StaffRole } from '@/context/RoleContext';
import type { ReactNode } from 'react';

interface RoleGuardProps {
  allowedRoles: StaffRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { hasPermission } = useRole();
  
  if (!hasPermission(allowedRoles)) {
    return fallback;
  }
  
  return <>{children}</>;
}

interface RoleBadgeProps {
  role: StaffRole;
  className?: string;
}

const roleStyles: Record<StaffRole, string> = {
  admin: 'bg-purple-100 text-purple-800 border-purple-200',
  manager: 'bg-blue-100 text-blue-800 border-blue-200',
  chef: 'bg-orange-100 text-orange-800 border-orange-200',
  barman: 'bg-green-100 text-green-800 border-green-200',
  reception: 'bg-pink-100 text-pink-800 border-pink-200',
  waiter: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  staff: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const label = role.charAt(0).toUpperCase() + role.slice(1);
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleStyles[role]} ${className}`}
    >
      {label}
    </span>
  );
}
