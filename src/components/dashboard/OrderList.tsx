'use client';

import type { ReactNode } from 'react';
import type { Order } from '@/types/staff';
import { formatMWK } from '@/utils/currency';
import Card from '@/components/ui/Card';

export default function OrderList({
  title,
  orders,
  emptyLabel,
  actions,
  filterItems,
}: {
  title: string;
  orders: Order[];
  emptyLabel: string;
  actions?: (order: Order) => ReactNode;
  filterItems?: (item: Order['items'][number]) => boolean;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

      {orders.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="text-gray-600">{emptyLabel}</div>
        </Card>
      ) : (
        orders.map((order) => {
          const visibleItems = filterItems ? order.items.filter(filterItems) : order.items;
          const visibleTotal = visibleItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

          return (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id.split('-')[1]}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.customerName} • Table {order.tableNumber}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="space-y-1">
                      {visibleItems.map((item) => (
                        <div key={item.itemId} className="flex justify-between text-sm">
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium">{formatMWK(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>{formatMWK(filterItems ? visibleTotal : order.totalAmount)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">Ordered {order.createdAt.toLocaleString()}</p>
                </div>

                {actions ? <div className="flex flex-wrap gap-2">{actions(order)}</div> : null}
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
