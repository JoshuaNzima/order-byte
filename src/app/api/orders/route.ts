import { NextRequest, NextResponse } from 'next/server';
import { addOrder, getOrdersByOrganization } from '@/backend/repositories/orderRepository';
import { organizations, menus } from '@/backend/data/seed-data';

function getTenantId(request: NextRequest): string | null {
  return request.headers.get('x-tenant-id');
}

function getCustomerSessionId(request: NextRequest): string | undefined {
  return request.cookies.get('ob_client_id')?.value;
}

function isNonNull<T>(value: T | null): value is T {
  return value !== null;
}

export async function POST(request: NextRequest) {
  try {
    const orderData = (await request.json()) as {
      organizationId?: string;
      customerSessionId?: string;
      customerName: string;
      tableNumber: string;
      items: Array<{
        itemId: string;
        quantity: number;
        notes?: string;
      }>;
      totalAmount?: number;
    };

    const organizationId = orderData.organizationId ?? getTenantId(request);
    const customerSessionId = orderData.customerSessionId ?? getCustomerSessionId(request);

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    if (!orderData.customerName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Customer name is required' },
        { status: 400 }
      );
    }

    if (!orderData.tableNumber?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Table number is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order items are required' },
        { status: 400 }
      );
    }

    const organizationExists = organizations.some((org) => org.id === organizationId);
    if (!organizationExists) {
      return NextResponse.json(
        { success: false, error: 'Invalid organization ID' },
        { status: 400 }
      );
    }

    const activeMenu = menus.find(
      (menu) => menu.organizationId === organizationId && menu.isActive
    );

    if (!activeMenu) {
      return NextResponse.json(
        { success: false, error: 'No active menu for organization' },
        { status: 400 }
      );
    }

    const itemIndex = new Map(
      activeMenu.categories
        .flatMap((c) => c.items)
        .map((item) => [item.id, item] as const)
    );

    const normalizedItems = orderData.items.map((item) => {
      const menuItem = itemIndex.get(item.itemId);
      if (!menuItem || !menuItem.available) {
        return null;
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return null;
      }

      return {
        itemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        notes: item.notes
      };
    });

    if (normalizedItems.some((i) => i === null)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order items' },
        { status: 400 }
      );
    }

    const validatedItems = normalizedItems.filter(isNonNull);
    const totalAmount = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = addOrder({
      organizationId,
      customerSessionId,
      customerName: orderData.customerName.trim(),
      tableNumber: orderData.tableNumber.trim(),
      items: validatedItems,
      totalAmount,
      status: 'pending'
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') ?? getTenantId(request);
    const customerSessionId =
      searchParams.get('customerSessionId') ?? getCustomerSessionId(request) ?? undefined;
    
    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const orders = getOrdersByOrganization(organizationId, customerSessionId);
    return NextResponse.json({ success: true, orders });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}