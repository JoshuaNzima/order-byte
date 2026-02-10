import { NextRequest, NextResponse } from 'next/server';
import { AuditLogRepository } from '@/backend/repositories/superadminRepository';

// Simple auth check
function isSuperAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === 'Bearer superadmin-demo-token' || 
         request.cookies.get('superadmin_session')?.value === 'valid';
}

export async function GET(request: NextRequest) {
  if (!isSuperAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const action = searchParams.get('action');
    const limit = parseInt(searchParams.get('limit') || '50');

    let logs = AuditLogRepository.getAll();

    // Filter by entity type
    if (entityType) {
      logs = logs.filter(log => log.entityType === entityType);
    }

    // Filter by action
    if (action) {
      logs = logs.filter(log => log.action === action);
    }

    // Apply limit
    logs = logs.slice(0, limit);

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}
