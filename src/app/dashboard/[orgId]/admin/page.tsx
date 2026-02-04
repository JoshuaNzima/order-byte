'use client';

import { use, useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AdminDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = use(params);
  const { orders, loading, error, fetchOrders } = useOrders(orgId);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const preparing = orders.filter((o) => o.status === 'preparing').length;
    const ready = orders.filter((o) => o.status === 'ready').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const cancelled = orders.filter((o) => o.status === 'cancelled').length;

    return { total, pending, preparing, ready, delivered, cancelled };
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">High-level operational overview</p>
        </div>

        <Button onClick={fetchOrders} size="sm" isLoading={loading}>
          Refresh
        </Button>
      </div>

      {error ? (
        <Card className="p-4">
          <div className="text-sm text-red-700">{error}</div>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Preparing" value={stats.preparing} />
        <StatCard label="Ready" value={stats.ready} />
        <StatCard label="Delivered" value={stats.delivered} />
        <StatCard label="Cancelled" value={stats.cancelled} />
      </div>

      <Card className="p-6">
        <div className="text-lg font-semibold text-gray-900">Next steps</div>
        <div className="text-gray-600 mt-2">
          This demo app currently has no authentication/permissions yet.
          We can wire roles to real users and lock these pages down once auth is added.
        </div>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </Card>
  );
}
