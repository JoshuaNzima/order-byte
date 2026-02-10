'use client';

import { useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import OrderList from '@/components/dashboard/OrderList';

export default function ReceptionDashboardClient({ tenantId }: { tenantId: string }) {
  const { orders, loading, error, fetchOrders } = useOrders(tenantId);

  const newOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'pending');
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reception / Help Desk</h1>
          <p className="text-gray-600 mt-1">Review newly placed orders and coordinate handoff</p>
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

      <OrderList title="New Orders" orders={newOrders} emptyLabel="No new orders" />
    </div>
  );
}
