'use client';

import { useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import OrderList from '@/components/dashboard/OrderList';

export default function WaiterDashboardPage({ params }: { params: { orgId: string } }) {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrders(params.orgId);

  const readyOrders = useMemo(() => {
    return orders.filter((o) => o.status === 'ready');
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Waiter / Waitress</h1>
          <p className="text-gray-600 mt-1">Deliver ready orders</p>
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
        title="Ready for Delivery"
        orders={readyOrders}
        emptyLabel="No orders ready for delivery"
        actions={(order) => (
          <>
            <Button
              size="sm"
              onClick={() => updateOrderStatus(order.id, 'delivered')}
            >
              Mark Delivered
            </Button>
          </>
        )}
      />
    </div>
  );
}
