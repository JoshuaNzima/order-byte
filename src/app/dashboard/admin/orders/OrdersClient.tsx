'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import OrderList from '@/components/dashboard/OrderList';

interface Session {
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
}

export default function OrdersPage({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { orders, loading: ordersLoading, error, fetchOrders, updateOrderStatus } = useOrders(tenantId);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = (await response.json()) as { success: boolean; session?: Session };

      if (!data.success || !['admin', 'manager', 'superadmin'].includes(data.session?.role || '')) {
        router.push('/login/staff');
        return;
      }

      setSession(data.session || null);
    } catch {
      router.push('/login/staff');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login/staff');
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

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
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
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
            <NavLink href="/dashboard/admin" label="Overview" icon="dashboard" />
            <NavLink href="/dashboard/admin/orders" label="Orders" icon="orders" active />
            <NavLink href="/dashboard/admin/menu" label="Menu" icon="menu" />
            <NavLink href="/dashboard/admin/staff" label="Staff" icon="staff" />
            <NavLink href="/dashboard/admin/settings" label="Settings" icon="settings" />
          </aside>

          <main className="space-y-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
                <p className="text-gray-600 mt-1">View and manage all orders</p>
              </div>
              <Button onClick={fetchOrders} size="sm" isLoading={ordersLoading}>
                Refresh
              </Button>
            </div>

            {error ? (
              <Card className="p-4">
                <div className="text-sm text-red-700">{error}</div>
              </Card>
            ) : null}

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {orders.filter((o) => o.status === status).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <OrderList
              title={`${filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)} Orders (${filteredOrders.length})`}
              orders={filteredOrders}
              emptyLabel="No orders found"
              actions={(order) => (
                <>
                  {order.status === 'pending' && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                      Start Preparing
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>
                      Mark Ready
                    </Button>
                  )}
                  {order.status === 'ready' && (
                    <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                      Mark Delivered
                    </Button>
                  )}
                  {(order.status === 'pending' || order.status === 'preparing') && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancel
                    </Button>
                  )}
                </>
              )}
            />
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
    menu: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    staff: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  };

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
      }`}
    >
      {icons[icon]}
      {label}
    </Link>
  );
}
