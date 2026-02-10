'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Order } from '@/shared/types/order';

type OrderDto = Omit<Order, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

function deserializeOrder(order: OrderDto): Order {
  return {
    ...order,
    createdAt: new Date(order.createdAt),
    updatedAt: new Date(order.updatedAt)
  };
}

export function useOrders(organizationId: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders?organizationId=${organizationId}`);
      const data = (await response.json()) as { success: boolean; orders?: OrderDto[]; error?: string };

      if (!data.success) {
        setError(data.error ?? 'Failed to fetch orders');
        setOrders([]);
        return;
      }

      setOrders((data.orders ?? []).map(deserializeOrder));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  const updateOrderStatus = useCallback(
    async (orderId: string, status: Order['status']) => {
      setError(null);
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });

        const data = (await response.json()) as { success: boolean; error?: string };
        if (!data.success) {
          setError(data.error ?? 'Failed to update order');
          return false;
        }

        await fetchOrders();
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update order');
        return false;
      }
    },
    [fetchOrders]
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [orders]);

  return {
    orders: sortedOrders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus
  };
}
