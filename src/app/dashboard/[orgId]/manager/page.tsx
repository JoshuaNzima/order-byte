'use client';

import { useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OrderList from '@/components/dashboard/OrderList';

export default function ManagerDashboardPage({ params }: { params: { orgId: string } }) {
  const { orders, loading, error, fetchOrders } = useOrders(params.orgId);

  const activeOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-1">Track service throughput and active workload</p>
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

      <OrderList title="Active Orders" orders={activeOrders} emptyLabel="No active orders" />
    </div>
  );
}
