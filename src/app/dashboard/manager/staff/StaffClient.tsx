'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Session {
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  lastActive: string;
}

const demoStaff: StaffMember[] = [
  { id: '1', name: 'Maria Garcia', email: 'maria@bellavista.com', role: 'Waiter', active: true, lastActive: '2 mins ago' },
  { id: '2', name: 'John Smith', email: 'john@bellavista.com', role: 'Chef', active: true, lastActive: '5 mins ago' },
  { id: '3', name: 'Lisa Chen', email: 'lisa@bellavista.com', role: 'Bartender', active: true, lastActive: '1 hour ago' },
  { id: '4', name: 'Carlos Ruiz', email: 'carlos@bellavista.com', role: 'Waiter', active: false, lastActive: '3 hours ago' },
  { id: '5', name: 'Emma Wilson', email: 'emma@bellavista.com', role: 'Reception', active: true, lastActive: 'Just now' },
];

export default function StaffClient({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [staff] = useState<StaffMember[]>(demoStaff);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = (await response.json()) as { success: boolean; session?: Session };

      if (!data.success || !['manager', 'admin', 'superadmin'].includes(data.session?.role || '')) {
        router.push('/login/staff');
        return;
      }

      setSession(data.session || null);
    } catch {
      router.push('/login/staff');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login/staff');
  };

  const filteredStaff = staff.filter((member) => {
    if (filter === 'all') return true;
    if (filter === 'active') return member.active;
    if (filter === 'inactive') return !member.active;
    return member.role.toLowerCase() === filter;
  });

  const stats = {
    total: staff.length,
    active: staff.filter((s) => s.active).length,
    roles: [...new Set(staff.map((s) => s.role))].length,
  };

  if (authLoading) {
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
              <div className="w-10 h-10 bg-green-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manager Dashboard</h1>
                <p className="text-sm text-gray-500">{session?.email}</p>
              </div>
            </div>
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
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          <aside className="space-y-2">
            <NavLink href="/dashboard/manager" label="Overview" icon="dashboard" />
            <NavLink href="/dashboard/manager/orders" label="Live Orders" icon="orders" />
            <NavLink href="/dashboard/manager/staff" label="Staff Status" icon="staff" active />
            <NavLink href="/dashboard/manager/analytics" label="Analytics" icon="analytics" />
          </aside>

          <main className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Staff Status</h2>
                <p className="text-gray-600 mt-1">Monitor team availability</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-blue-50 border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                <div className="text-sm text-blue-600 mt-1">Total Staff</div>
              </Card>
              <Card className="p-4 bg-green-50 border-green-200 text-center">
                <div className="text-2xl font-bold text-green-700">{stats.active}</div>
                <div className="text-sm text-green-600 mt-1">Currently Active</div>
              </Card>
              <Card className="p-4 bg-purple-50 border-purple-200 text-center">
                <div className="text-2xl font-bold text-purple-700">{stats.roles}</div>
                <div className="text-sm text-purple-600 mt-1">Different Roles</div>
              </Card>
            </div>

            <div className="flex gap-2 flex-wrap">
              <FilterButton active={filter === 'all'} label="All" onClick={() => setFilter('all')} />
              <FilterButton active={filter === 'active'} label="Active" onClick={() => setFilter('active')} color="green" />
              <FilterButton active={filter === 'inactive'} label="Inactive" onClick={() => setFilter('inactive')} color="gray" />
              <FilterButton active={filter === 'waiter'} label="Waiters" onClick={() => setFilter('waiter')} color="blue" />
              <FilterButton active={filter === 'chef'} label="Chefs" onClick={() => setFilter('chef')} color="orange" />
              <FilterButton active={filter === 'bartender'} label="Bartenders" onClick={() => setFilter('bartender')} color="purple" />
            </div>

            <div className="space-y-4">
              {filteredStaff.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${member.active ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${member.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className={`text-sm font-medium ${member.active ? 'text-green-600' : 'text-gray-500'}`}>
                          {member.active ? 'Active' : 'Offline'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Last active: {member.lastActive}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: string; active?: boolean }) {
  const icons: Record<string, ReactNode> = {
    dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    orders: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    staff: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    analytics: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  };

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
      }`}
    >
      {icons[icon]}
      {label}
    </Link>
  );
}

function FilterButton({ active, label, onClick, color = 'gray' }: { active: boolean; label: string; onClick: () => void; color?: string }) {
  const colors: Record<string, string> = {
    gray: active ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    green: active ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200',
    blue: active ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    orange: active ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    purple: active ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${colors[color]}`}
    >
      {label}
    </button>
  );
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    Waiter: 'bg-blue-100 text-blue-800',
    Chef: 'bg-orange-100 text-orange-800',
    Bartender: 'bg-purple-100 text-purple-800',
    Reception: 'bg-pink-100 text-pink-800',
    Manager: 'bg-green-100 text-green-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
}
