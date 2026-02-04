'use client';

import { use, useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import OrderList from '@/components/dashboard/OrderList';

const beverageKeywords = ['coffee', 'cappuccino', 'latte', 'tea', 'juice', 'smoothie', 'soda', 'cola', 'beer', 'wine', 'cocktail'];

function isBeverageItem(name: string) {
  const lower = name.toLowerCase();
  return beverageKeywords.some((k) => lower.includes(k));
}

export default function BarmanDashboardPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = use(params);
  const { orders, loading, error, fetchOrders } = useOrders(orgId);

  const barOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === 'pending' || o.status === 'preparing')
      .filter((o) => o.items.some((i) => isBeverageItem(i.name)));
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Barman Dashboard</h1>
          <p className="text-gray-600 mt-1">Beverage queue (filtered by item names)</p>
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
        title="Bar Orders"
        orders={barOrders}
        emptyLabel="No bar orders"
        filterItems={(item) => isBeverageItem(item.name)}
      />
    </div>
  );
}
