import { NextRequest, NextResponse } from 'next/server';
import { addOrder, getOrdersByOrganization } from '@/data/orders';

export async function POST(request: NextRequest) {
  try {
    const orderData: any = await request.json();
    
    const newOrder = addOrder({
      organizationId: orderData.organizationId,
      customerName: orderData.customerName,
      tableNumber: orderData.tableNumber,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending'
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    
    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const orders = getOrdersByOrganization(organizationId);
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}