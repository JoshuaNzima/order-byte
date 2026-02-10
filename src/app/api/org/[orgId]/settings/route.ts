import { NextRequest, NextResponse } from 'next/server';
import { OrganizationRepository } from '@/backend/repositories/superadminRepository';
import type { OrganizationSettings } from '@/shared/types/superadmin';

// Simple auth check for organization
function validateOrganization(orgId: string): boolean {
  const org = OrganizationRepository.getById(orgId);
  return !!org;
}

// GET /api/org/[orgId]/settings - Get organization settings
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

    const org = OrganizationRepository.getById(orgId);
    
    return NextResponse.json({
      success: true,
      settings: org!.settings,
      theme: org!.theme,
      contact: org!.contact,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH /api/org/[orgId]/settings - Update organization settings
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

    const body = (await request.json()) as {
      settings?: Partial<OrganizationSettings>;
      theme?: {
        primaryColor?: string;
        secondaryColor?: string;
        accentColor?: string;
      };
      contact?: {
        phone?: string;
        website?: string;
      };
    };

    const updates: Parameters<typeof OrganizationRepository.update>[1] = {
      settings: body.settings as OrganizationSettings | undefined,
      theme: body.theme as { primaryColor: string; secondaryColor: string; accentColor: string } | undefined,
      contact: body.contact as { phone?: string; website?: string } | undefined,
    };

    const updatedOrg = OrganizationRepository.update(orgId, updates);
    
    if (!updatedOrg) {
      return NextResponse.json(
        { success: false, error: 'Failed to update settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: updatedOrg.settings,
      theme: updatedOrg.theme,
      contact: updatedOrg.contact,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
