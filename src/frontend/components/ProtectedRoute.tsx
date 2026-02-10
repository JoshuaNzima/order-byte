'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthSession } from '@/shared/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('superadmin' | 'admin' | 'manager' | 'staff')[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = '/login/staff',
}: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = (await response.json()) as { success: boolean; session?: AuthSession };

        if (data.success && data.session) {
          // Check if role is allowed (if specified)
          if (allowedRoles.length > 0 && !allowedRoles.includes(data.session.role)) {
            setIsAuthenticated(false);
            router.push(redirectTo);
            return;
          }
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push(redirectTo);
        }
      } catch {
        setIsAuthenticated(false);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, allowedRoles, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
