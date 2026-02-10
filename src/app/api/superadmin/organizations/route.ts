import { NextRequest, NextResponse } from 'next/server';
import { OrganizationRepository, AuditLogRepository } from '@/backend/repositories/superadminRepository';
import type { CreateOrganizationRequest } from '@/shared/types/superadmin';

// Simple auth check - in production, use proper authentication
function isSuperAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  // For demo, check a simple token or session
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
    const organizations = OrganizationRepository.getAll();
    const stats = OrganizationRepository.getStats();
    
    return NextResponse.json({
      success: true,
      organizations,
      stats,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isSuperAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as CreateOrganizationRequest;

    // Validate required fields
    if (!body.id || !body.name || !body.theme) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if organization already exists
    const existing = OrganizationRepository.getById(body.id);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Organization ID already exists' },
        { status: 400 }
      );
    }

    const organization = OrganizationRepository.create(body);

    // Log the action
    AuditLogRepository.create({
      action: 'create',
      entityType: 'organization',
      entityId: organization.id,
      performedBy: 'superadmin',
      details: { name: organization.name },
    });

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}
