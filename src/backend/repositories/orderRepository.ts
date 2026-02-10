import type { Order } from '@/shared/types/order';

export const orders: Order[] = [
  {
    id: 'order-1',
    organizationId: 'bella-vista',
    customerName: 'Sarah Johnson',
    tableNumber: '12',
    items: [
      {
        itemId: 'margherita',
        name: 'Margherita Pizza',
        price: 27690,
        quantity: 1
      },
      {
        itemId: 'carbonara',
        name: 'Pasta Carbonara',
        price: 30970,
        quantity: 1
      }
    ],
    totalAmount: 58660,
    status: 'preparing',
    createdAt: new Date(Date.now() - 15 * 60000),
    updatedAt: new Date(Date.now() - 15 * 60000)
  },
  {
    id: 'order-2',
    organizationId: 'urban-cafe',
    customerName: 'Mike Chen',
    tableNumber: '5',
    items: [
      {
        itemId: 'avocado-toast',
        name: 'Avocado Toast',
        price: 21170,
        quantity: 2
      },
      {
        itemId: 'cappuccino',
        name: 'Cappuccino',
        price: 8130,
        quantity: 1
      }
    ],
    totalAmount: 50470,
    status: 'ready',
    createdAt: new Date(Date.now() - 8 * 60000),
    updatedAt: new Date(Date.now() - 2 * 60000)
  }
];

export function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
  const newOrder: Order = {
    ...order,
    id: `order-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  orders.push(newOrder);
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order['status']) {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  if (orderIndex >= 0) {
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();
    return orders[orderIndex];
  }
  return null;
}

export function getOrdersByOrganization(organizationId: string, customerSessionId?: string) {
  const orgOrders = orders.filter(order => order.organizationId === organizationId);
  if (!customerSessionId) return orgOrders;
  return orgOrders.filter(order => order.customerSessionId === customerSessionId);
}
