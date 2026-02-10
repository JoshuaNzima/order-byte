import { NextRequest, NextResponse } from 'next/server';
import { OrganizationRepository } from '@/backend/repositories/superadminRepository';
import type { StaffUser } from '@/shared/types/order';

// In-memory staff storage (would be database in production)
const staffUsers: StaffUser[] = [
  {
    id: 'staff-1',
    organizationId: 'bella-vista',
    email: 'manager@bellavista.com',
    name: 'John Manager',
    role: 'manager',
    createdAt: new Date(),
  },
  {
    id: 'staff-2',
    organizationId: 'urban-cafe',
    email: 'admin@urbancafe.com',
    name: 'Sarah Admin',
    role: 'admin',
    createdAt: new Date(),
  },
];

// Simple auth check for organization
function validateOrganization(orgId: string): boolean {
  const org = OrganizationRepository.getById(orgId);
  return !!org;
}

// GET /api/org/[orgId]/staff - Get all staff for organization
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

    const orgStaff = staffUsers.filter(s => s.organizationId === orgId);

    return NextResponse.json({
      success: true,
      staff: orgStaff,
      count: orgStaff.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

// POST /api/org/[orgId]/staff - Add new staff member
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
      email: string;
      name: string;
      role: 'admin' | 'manager' | 'staff';
    };

    const { email, name, role } = body;

    // Validation
    if (!email || !name || !role) {
      return NextResponse.json(
        { success: false, error: 'Email, name, and role are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingStaff = staffUsers.find(s => s.email === email && s.organizationId === orgId);
    if (existingStaff) {
      return NextResponse.json(
        { success: false, error: 'Staff member with this email already exists' },
        { status: 409 }
      );
    }

    const newStaff: StaffUser = {
      id: `staff-${Date.now()}`,
      organizationId: orgId,
      email,
      name,
      role,
      createdAt: new Date(),
    };

    staffUsers.push(newStaff);

    return NextResponse.json({
      success: true,
      staff: newStaff,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to add staff member' },
      { status: 500 }
    );
  }
}

// PATCH /api/org/[orgId]/staff - Update staff member
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
      staffId: string;
      updates: Partial<Omit<StaffUser, 'id' | 'organizationId' | 'createdAt'>>;
    };

    const { staffId, updates } = body;

    const staffIndex = staffUsers.findIndex(s => s.id === staffId && s.organizationId === orgId);
    if (staffIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    Object.assign(staffUsers[staffIndex], updates);

    return NextResponse.json({
      success: true,
      staff: staffUsers[staffIndex],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

// DELETE /api/org/[orgId]/staff - Remove staff member
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
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json(
        { success: false, error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    const staffIndex = staffUsers.findIndex(s => s.id === staffId && s.organizationId === orgId);
    if (staffIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    staffUsers.splice(staffIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Staff member removed',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to remove staff member' },
      { status: 500 }
    );
  }
}
