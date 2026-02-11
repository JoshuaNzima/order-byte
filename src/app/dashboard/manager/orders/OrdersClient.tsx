'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Session {
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
}

export default function OrdersClient({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrders(tenantId);

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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus as any);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
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
            <NavLink href="/dashboard/manager/orders" label="Live Orders" icon="orders" active />
            <NavLink href="/dashboard/manager/staff" label="Staff Status" icon="staff" />
            <NavLink href="/dashboard/manager/analytics" label="Analytics" icon="analytics" />
          </aside>

          <main className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Live Orders</h2>
                <p className="text-gray-600 mt-1">Manage all orders in real-time</p>
              </div>
              <Button onClick={fetchOrders} size="sm" isLoading={loading}>
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <FilterButton active={filter === 'all'} count={stats.total} label="All" onClick={() => setFilter('all')} />
              <FilterButton active={filter === 'pending'} count={stats.pending} label="Pending" onClick={() => setFilter('pending')} color="yellow" />
              <FilterButton active={filter === 'preparing'} count={stats.preparing} label="Preparing" onClick={() => setFilter('preparing')} color="orange" />
              <FilterButton active={filter === 'ready'} count={stats.ready} label="Ready" onClick={() => setFilter('ready')} color="green" />
              <FilterButton active={filter === 'delivered'} count={stats.delivered} label="Delivered" onClick={() => setFilter('delivered')} color="gray" />
            </div>

            {error ? (
              <Card className="p-4">
                <div className="text-sm text-red-700">{error}</div>
              </Card>
            ) : null}

            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">No orders found</p>
                </Card>
              ) : (
                filteredOrders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">Table {order.tableNumber}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.customerName} • {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{item.quantity}x {item.name}</span>
                            <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                      {order.status === 'pending' && (
                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'preparing')}>
                          Start Preparing
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'ready')}>
                          Mark Ready
                        </Button>
                      )}
                      {order.status === 'ready' && (
                        <Button size="sm" onClick={() => handleStatusUpdate(order.id, 'delivered')}>
                          Mark Delivered
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        disabled={order.status === 'cancelled' || order.status === 'delivered'}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                ))
              )}
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

function FilterButton({ active, count, label, onClick, color = 'gray' }: { active: boolean; count: number; label: string; onClick: () => void; color?: string }) {
  const colors: Record<string, string> = {
    gray: active ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    yellow: active ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    orange: active ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    green: active ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200',
  };

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg text-sm font-medium transition-colors ${colors[color]}`}
    >
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-xs mt-1 opacity-90">{label}</div>
    </button>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
