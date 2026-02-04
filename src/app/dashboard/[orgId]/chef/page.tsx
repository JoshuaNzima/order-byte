'use client';

import { useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import OrderList from '@/components/dashboard/OrderList';

export default function ChefDashboardPage({ params }: { params: { orgId: string } }) {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrders(params.orgId);

  const kitchenOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'pending' || o.status === 'preparing');
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chef Dashboard</h1>
          <p className="text-gray-600 mt-1">Kitchen queue: accept and mark orders ready</p>
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

      <OrderList
        title="Kitchen Queue"
        orders={kitchenOrders}
        emptyLabel="No kitchen orders"
        actions={(order) => (
          <>
            {order.status === 'pending' ? (
              <Button
                size="sm"
                onClick={() => updateOrderStatus(order.id, 'preparing')}
              >
                Accept
              </Button>
            ) : null}
            {order.status === 'preparing' ? (
              <Button
                size="sm"
                onClick={() => updateOrderStatus(order.id, 'ready')}
              >
                Mark Ready
              </Button>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
