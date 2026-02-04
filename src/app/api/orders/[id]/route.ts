import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/data/orders';
import type { Order } from '@/types/staff';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = (await request.json()) as { status: Order['status'] };
    const { id: orderId } = await params;

    const updatedOrder = updateOrderStatus(orderId, status);
    
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}