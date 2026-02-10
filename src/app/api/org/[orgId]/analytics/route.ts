import { NextRequest, NextResponse } from 'next/server';
import { OrganizationRepository } from '@/backend/repositories/superadminRepository';
import { orders } from '@/backend/repositories/orderRepository';

// Simple auth check for organization
function validateOrganization(orgId: string): boolean {
  const org = OrganizationRepository.getById(orgId);
  return !!org;
}

// GET /api/org/[orgId]/analytics - Get organization analytics
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
    const period = searchParams.get('period') || 'today'; // today, week, month

    // Get organization orders
    const orgOrders = orders.filter(o => o.organizationId === orgId);
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default: // today
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
    }

    // Filter orders by date range
    const periodOrders = orgOrders.filter(o => new Date(o.createdAt) >= startDate);

    // Calculate stats
    const totalOrders = periodOrders.length;
    const totalRevenue = periodOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Orders by status
    const ordersByStatus = periodOrders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top items
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    periodOrders.forEach(order => {
      order.items.forEach(item => {
        if (!itemCounts[item.itemId]) {
          itemCounts[item.itemId] = {
            name: item.name,
            count: 0,
            revenue: 0,
          };
        }
        itemCounts[item.itemId].count += item.quantity;
        itemCounts[item.itemId].revenue += item.price * item.quantity;
      });
    });

    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      analytics: {
        period,
        totalOrders,
        totalRevenue,
        avgOrderValue,
        ordersByStatus,
        topItems,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
