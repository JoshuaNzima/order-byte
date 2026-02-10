import { NextRequest, NextResponse } from 'next/server';
import { OrganizationRepository } from '@/backend/repositories/superadminRepository';
import { orders } from '@/backend/repositories/orderRepository';
import type { Order } from '@/shared/types/order';

type OrderStatus = Order['status'];

// Simple auth check for organization
function validateOrganization(orgId: string): boolean {
  const org = OrganizationRepository.getById(orgId);
  return !!org;
}

// GET /api/org/[orgId]/orders - Get all orders for organization
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    
    if (!validateOrganization(orgId)) {
      return NextResponse.json(
        { success: false, error: 'Organization not found or inactive' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const limit = parseInt(searchParams.get('limit') || '50');

    // Filter orders by organization
    let orgOrders = orders.filter((o: Order) => o.organizationId === orgId);

    // Filter by status if provided
    if (status) {
      orgOrders = orgOrders.filter(o => o.status === status);
    }

    // Sort by created date (newest first)
    orgOrders = orgOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Limit results
    orgOrders = orgOrders.slice(0, limit);

    return NextResponse.json({
      success: true,
      orders: orgOrders,
      count: orgOrders.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/org/[orgId]/orders - Create new order
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    
    if (!validateOrganization(orgId)) {
      return NextResponse.json(
        { success: false, error: 'Organization not found or inactive' },
        { status: 404 }
      );
    }

    const body = (await request.json()) as {
      items: { itemId: string; name: string; price: number; quantity: number; notes?: string }[];
      tableNumber: string;
      notes?: string;
      customerName: string;
      customerSessionId?: string;
      totalAmount?: number;
    };
    const { items, tableNumber, notes, customerName, customerSessionId, totalAmount } = body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!customerName) {
      return NextResponse.json(
        { success: false, error: 'Customer name is required' },
        { status: 400 }
      );
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      organizationId: orgId,
      customerSessionId,
      customerName,
      items: items.map((item) => ({
        itemId: item.itemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes,
      })),
      status: 'pending',
      totalAmount: totalAmount || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      tableNumber: tableNumber || '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    orders.push(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PATCH /api/org/[orgId]/orders - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    
    if (!validateOrganization(orgId)) {
      return NextResponse.json(
        { success: false, error: 'Organization not found or inactive' },
        { status: 404 }
      );
    }

    const body = (await request.json()) as { orderId: string; status: OrderStatus };
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    const order = orders.find((o: Order) => o.id === orderId && o.organizationId === orgId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    order.status = status as OrderStatus;
    order.updatedAt = new Date();

    return NextResponse.json({
      success: true,
      order,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/org/[orgId]/orders - Cancel order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const { orgId } = await params;
    
    if (!validateOrganization(orgId)) {
      return NextResponse.json(
        { success: false, error: 'Organization not found or inactive' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const orderIndex = orders.findIndex((o: Order) => o.id === orderId && o.organizationId === orgId);
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Soft delete - mark as cancelled
    orders[orderIndex].status = 'cancelled';
    orders[orderIndex].updatedAt = new Date();

    return NextResponse.json({
      success: true,
      message: 'Order cancelled',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
