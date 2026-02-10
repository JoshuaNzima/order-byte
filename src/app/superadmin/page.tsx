'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { OrganizationRepository } from '@/backend/repositories/superadminRepository';
import type { OrganizationWithSettings } from '@/shared/types/superadmin';

interface Session {
  userId: string;
  email: string;
  role: string;
}

interface Stats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<OrganizationWithSettings[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrganizations: 0,
    activeOrganizations: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = (await response.json()) as { success: boolean; session?: { role: string; email: string; userId: string } };
      
      if (!data.success || data.session?.role !== 'superadmin') {
        router.push('/login/superadmin');
        return;
      }
      
      setSession(data.session);
    } catch {
      router.push('/login/superadmin');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = () => {
    const orgs = OrganizationRepository.getAll();
    const s = OrganizationRepository.getStats();
    setOrganizations(orgs);
    setStats(s);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login/superadmin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Super Admin</h1>
                <p className="text-sm text-gray-500">{session?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/superadmin/audit-logs" className="text-gray-600 hover:text-gray-900 font-medium">
                Audit Logs
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <Link href="/superadmin/organizations/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            + Add Organization
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Total Organizations</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrganizations}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Active Organizations</p>
            <p className="text-3xl font-bold text-green-600">{stats.activeOrganizations}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Organizations</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {organizations.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">No organizations yet. Create your first one!</div>
            ) : (
              organizations.slice(0, 5).map((org) => (
                <div key={org.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: org.theme.primaryColor }}>
                      {org.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{org.name}</h3>
                      <p className="text-sm text-gray-500">{org.contact.phone || 'No phone'} • {org.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  <Link href={`/superadmin/organizations/${org.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Manage →</Link>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
