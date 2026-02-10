'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type StaffRole = 'admin' | 'manager' | 'chef' | 'barman' | 'reception' | 'waiter' | 'staff';

interface RoleContextType {
  role: StaffRole;
  setRole: (role: StaffRole) => void;
  hasPermission: (allowedRoles: StaffRole[]) => boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

const ROLE_COOKIE_NAME = 'ob_demo_role';

function getRoleFromCookie(): StaffRole | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`${ROLE_COOKIE_NAME}=([^;]+)`));
  const value = match?.[1];
  if (value && isValidRole(value)) {
    return value as StaffRole;
  }
  return null;
}

function setRoleCookie(role: StaffRole) {
  if (typeof document === 'undefined') return;
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  document.cookie = `${ROLE_COOKIE_NAME}=${role};path=/;max-age=${maxAge};SameSite=Lax`;
}

function isValidRole(value: string): value is StaffRole {
  return ['admin', 'manager', 'chef', 'barman', 'reception', 'waiter', 'staff'].includes(value);
}

export function RoleProvider({ children, initialRole = 'admin' }: { children: ReactNode; initialRole?: StaffRole }) {
  const [role, setRoleState] = useState<StaffRole>(() => getRoleFromCookie() ?? initialRole);

  const setRole = useCallback((newRole: StaffRole) => {
    setRoleState(newRole);
    setRoleCookie(newRole);
  }, []);

  const hasPermission = useCallback((allowedRoles: StaffRole[]) => {
    return allowedRoles.includes(role);
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole, hasPermission }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
