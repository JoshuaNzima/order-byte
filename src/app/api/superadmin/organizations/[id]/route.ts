import { NextRequest, NextResponse } from 'next/server';
import { OrganizationRepository, AuditLogRepository } from '@/backend/repositories/superadminRepository';
import type { OrganizationSettings, OrganizationWithSettings } from '@/shared/types/superadmin';

// Simple auth check
function isSuperAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader === 'Bearer superadmin-demo-token' || 
         request.cookies.get('superadmin_session')?.value === 'valid';
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSuperAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<
      Omit<OrganizationWithSettings, 'id' | 'createdAt' | 'theme' | 'contact' | 'settings'>
    > & {
      theme?: Partial<OrganizationWithSettings['theme']>;
      contact?: Partial<OrganizationWithSettings['contact']>;
      settings?: Partial<OrganizationWithSettings['settings']>;
    };

    const organization = OrganizationRepository.update(id, body as Partial<Omit<OrganizationWithSettings, 'id' | 'createdAt'>>);

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    AuditLogRepository.create({
      action: 'update',
      entityType: 'organization',
      entityId: id,
      performedBy: 'superadmin',
      details: body,
    });

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update organization' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isSuperAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const success = OrganizationRepository.delete(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    AuditLogRepository.create({
      action: 'delete',
      entityType: 'organization',
      entityId: id,
      performedBy: 'superadmin',
      details: {},
    });

    return NextResponse.json({
      success: true,
      message: 'Organization deleted successfully',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete organization' },
      { status: 500 }
    );
  }
}
