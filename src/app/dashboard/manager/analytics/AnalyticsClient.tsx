'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface Session {
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
}

export default function AnalyticsClient({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { orders, loading, error, fetchOrders } = useOrders(tenantId);

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

  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const todayRevenue = todayOrders.filter((o) => o.status === 'delivered').reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;
  const completionRate = orders.length > 0 ? (orders.filter((o) => o.status === 'delivered').length / orders.length) * 100 : 0;

  const hourlyData = [
    { hour: '08:00', orders: 12, revenue: 340 },
    { hour: '10:00', orders: 18, revenue: 520 },
    { hour: '12:00', orders: 32, revenue: 980 },
    { hour: '14:00', orders: 24, revenue: 720 },
    { hour: '16:00', orders: 15, revenue: 450 },
    { hour: '18:00', orders: 28, revenue: 890 },
    { hour: '20:00', orders: 22, revenue: 650 },
    { hour: '22:00', orders: 8, revenue: 240 },
  ];

  const topItems = [
    { name: 'Margherita Pizza', orders: 45, revenue: 675 },
    { name: 'Caesar Salad', orders: 38, revenue: 456 },
    { name: 'Grilled Salmon', orders: 32, revenue: 896 },
    { name: 'Beef Burger', orders: 28, revenue: 420 },
    { name: 'Pasta Carbonara', orders: 25, revenue: 375 },
  ];

  const maxOrders = Math.max(...hourlyData.map((d) => d.orders));
  const maxRevenue = Math.max(...hourlyData.map((d) => d.revenue));

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
            <NavLink href="/dashboard/manager/staff" label="Staff Status" icon="staff" />
            <NavLink href="/dashboard/manager/analytics" label="Analytics" icon="analytics" active />
          </aside>

          <main className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                <p className="text-gray-600 mt-1">Performance insights</p>
              </div>
              <Button onClick={fetchOrders} size="sm" isLoading={loading}>
                Refresh Data
              </Button>
            </div>

            {error ? (
              <Card className="p-4">
                <div className="text-sm text-red-700">{error}</div>
              </Card>
            ) : null}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="text-2xl font-bold text-green-700">${todayRevenue.toFixed(2)}</div>
                <div className="text-sm text-green-600 mt-1">Today's Revenue</div>
              </Card>
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="text-2xl font-bold text-blue-700">{todayOrders.length}</div>
                <div className="text-sm text-blue-600 mt-1">Orders Today</div>
              </Card>
              <Card className="p-4 bg-purple-50 border-purple-200">
                <div className="text-2xl font-bold text-purple-700">${avgOrderValue.toFixed(2)}</div>
                <div className="text-sm text-purple-600 mt-1">Avg Order Value</div>
              </Card>
              <Card className="p-4 bg-orange-50 border-orange-200">
                <div className="text-2xl font-bold text-orange-700">{completionRate.toFixed(0)}%</div>
                <div className="text-sm text-orange-600 mt-1">Completion Rate</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Performance (Mock Data)</h3>
                <div className="space-y-4">
                  {hourlyData.map((data) => (
                    <div key={data.hour} className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-500">{data.hour}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="h-4 bg-blue-500 rounded"
                            style={{ width: `${(data.orders / maxOrders) * 100}%` }}
                          ></div>
                          <span className="text-xs text-gray-600">{data.orders} orders</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 bg-green-500 rounded"
                            style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                          ></div>
                          <span className="text-xs text-gray-600">${data.revenue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-600">Orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Revenue</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Menu Items (Mock Data)</h3>
                <div className="space-y-3">
                  {topItems.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 flex items-center justify-center bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${item.revenue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h3>
              <div className="grid grid-cols-5 gap-4">
                <StatusCard label="Pending" count={orders.filter((o) => o.status === 'pending').length} color="yellow" />
                <StatusCard label="Preparing" count={orders.filter((o) => o.status === 'preparing').length} color="orange" />
                <StatusCard label="Ready" count={orders.filter((o) => o.status === 'ready').length} color="green" />
                <StatusCard label="Delivered" count={orders.filter((o) => o.status === 'delivered').length} color="blue" />
                <StatusCard label="Cancelled" count={orders.filter((o) => o.status === 'cancelled').length} color="red" />
              </div>
            </Card>
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

function StatusCard({ label, count, color }: { label: string; count: number; color: string }) {
  const colors: Record<string, string> = {
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className={`p-4 text-center rounded-lg ${colors[color]}`}>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-sm mt-1">{label}</div>
    </div>
  );
}
