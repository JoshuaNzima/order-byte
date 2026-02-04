'use client';

import { useState, useEffect, type ChangeEvent, type ReactElement } from 'react';
import { Order } from '@/types/staff';
import { organizations } from '@/data/sample-data';
import { formatMWK } from '@/utils/currency';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function StaffDashboard() {
  const statColors: Record<'yellow' | 'blue' | 'green' | 'gray', string> = {
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    gray: 'text-gray-600'
  };

  type OrderDto = Omit<Order, 'createdAt' | 'updatedAt'> & {
    createdAt: string;
    updatedAt: string;
  };

  const deserializeOrder = (order: OrderDto): Order => {
    return {
      ...order,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    };
  };

  const [selectedOrg, setSelectedOrg] = useState('bella-vista');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const organization = organizations.find(org => org.id === selectedOrg);

  useEffect(() => {
    fetchOrders();
  }, [selectedOrg]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders?organizationId=${selectedOrg}`);
      const data = (await response.json()) as { success: boolean; orders?: OrderDto[] };
      if (data.success && data.orders) {
        setOrders(data.orders.map(deserializeOrder));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const data = (await response.json()) as { success: boolean };
      if (data.success) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusActions = (order: Order) => {
    const actions: Array<{ id: string; element: ReactElement }> = [];

    if (order.status === 'pending') {
      actions.push({
        id: 'accept',
        element: (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'preparing')}
            style={{ backgroundColor: organization?.theme.accentColor }}
          >
            Accept Order
          </Button>
        )
      });
      actions.push({
        id: 'cancel',
        element: (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'cancelled')}
          >
            Cancel
          </Button>
        )
      });
    }

    if (order.status === 'preparing') {
      actions.push({
        id: 'ready',
        element: (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'ready')}
            style={{ backgroundColor: organization?.theme.accentColor }}
          >
            Mark Ready
          </Button>
        )
      });
    }

    if (order.status === 'ready') {
      actions.push({
        id: 'delivered',
        element: (
          <Button
            size="sm"
            onClick={() => updateOrderStatus(order.id, 'delivered')}
            style={{ backgroundColor: organization?.theme.accentColor }}
          >
            Mark Delivered
          </Button>
        )
      });
    }

    return actions.map(({ id, element }) => <span key={id}>{element}</span>);
  };

  if (!organization) return <div>Organization not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage orders for {organization.name}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedOrg}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedOrg(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              
              <Button onClick={fetchOrders} size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'yellow' },
            { label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length, color: 'blue' },
            { label: 'Ready', count: orders.filter(o => o.status === 'ready').length, color: 'green' },
            { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: 'gray' }
          ].map((stat) => (
            <Card key={stat.label} className="p-6 text-center">
              <div className={`text-3xl font-bold ${statColors[stat.color as keyof typeof statColors]} mb-2`}>
                {stat.count}
              </div>
              <div className="text-gray-600">{stat.label} Orders</div>
            </Card>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600">Orders will appear here when customers place them.</p>
            </Card>
          ) : (
            orders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="font-medium">{formatMWK(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{formatMWK(order.totalAmount)}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Ordered {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {getStatusActions(order)}
                    </div>
                  </div>
                </Card>
              ))
          )}
        </div>
      </div>
    </div>
  );
}