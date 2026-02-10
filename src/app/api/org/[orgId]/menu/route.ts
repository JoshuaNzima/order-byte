import { NextRequest, NextResponse } from 'next/server';
import { OrganizationRepository } from '@/backend/repositories/superadminRepository';
import { menus } from '@/backend/data/seed-data';
import type { Menu, MenuCategory, MenuItem } from '@/shared/types/menu';

// Simple auth check for organization - validates the org exists and is active
function validateOrganization(orgId: string): boolean {
  const org = OrganizationRepository.getById(orgId);
  return !!org;
}

// GET /api/org/[orgId]/menu - Get organization's menu
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

    // Find menu for this organization
    const menu = menus.find(m => m.id === orgId);
    
    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      menu,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

// POST /api/org/[orgId]/menu - Update menu (add category or item)
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

    const body = (await request.json()) as { action: string; data: Record<string, unknown> };
    const { action, data } = body;

    const menu = menus.find(m => m.id === orgId);
    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'addCategory': {
        const newCategory: MenuCategory = {
          id: `cat-${Date.now()}`,
          name: data.name as string,
          description: data.description as string | undefined,
          items: [],
          order: menu.categories.length + 1,
        };
        menu.categories.push(newCategory);
        return NextResponse.json({
          success: true,
          category: newCategory,
        });
      }

      case 'addItem': {
        const { categoryId, item } = data;
        const category = menu.categories.find(c => c.id === categoryId);
        if (!category) {
          return NextResponse.json(
            { success: false, error: 'Category not found' },
            { status: 404 }
          );
        }
        const newItem: MenuItem = {
          id: `item-${Date.now()}`,
          name: (item as Record<string, unknown>).name as string,
          description: (item as Record<string, unknown>).description as string,
          price: (item as Record<string, unknown>).price as number,
          image: (item as Record<string, unknown>).image as string | undefined,
          allergens: (item as Record<string, unknown>).allergens as string[] | undefined,
          dietary: (item as Record<string, unknown>).dietary as ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free')[] | undefined,
          available: ((item as Record<string, unknown>).available as boolean) ?? true,
        };
        category.items.push(newItem);
        return NextResponse.json({
          success: true,
          item: newItem,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update menu' },
      { status: 500 }
    );
  }
}

// PATCH /api/org/[orgId]/menu - Update menu item or category
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

    const body = (await request.json()) as { action: string; data: Record<string, unknown> };
    const { action, data } = body;

    const menu = menus.find(m => m.id === orgId);
    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'updateCategory': {
        const category = menu.categories.find(c => c.id === data.id);
        if (!category) {
          return NextResponse.json(
            { success: false, error: 'Category not found' },
            { status: 404 }
          );
        }
        Object.assign(category, data.updates);
        return NextResponse.json({
          success: true,
          category,
        });
      }

      case 'updateItem': {
        const { categoryId, itemId, updates } = data;
        const category = menu.categories.find(c => c.id === categoryId);
        if (!category) {
          return NextResponse.json(
            { success: false, error: 'Category not found' },
            { status: 404 }
          );
        }
        const item = category.items.find(i => i.id === itemId);
        if (!item) {
          return NextResponse.json(
            { success: false, error: 'Item not found' },
            { status: 404 }
          );
        }
        Object.assign(item, updates);
        return NextResponse.json({
          success: true,
          item,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update menu' },
      { status: 500 }
    );
  }
}

// DELETE /api/org/[orgId]/menu - Delete category or item
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
    const action = searchParams.get('action');
    const categoryId = searchParams.get('categoryId');
    const itemId = searchParams.get('itemId');

    const menu = menus.find(m => m.id === orgId);
    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'deleteCategory': {
        const index = menu.categories.findIndex(c => c.id === categoryId);
        if (index === -1) {
          return NextResponse.json(
            { success: false, error: 'Category not found' },
            { status: 404 }
          );
        }
        menu.categories.splice(index, 1);
        return NextResponse.json({
          success: true,
          message: 'Category deleted',
        });
      }

      case 'deleteItem': {
        const category = menu.categories.find(c => c.id === categoryId);
        if (!category) {
          return NextResponse.json(
            { success: false, error: 'Category not found' },
            { status: 404 }
          );
        }
        const itemIndex = category.items.findIndex(i => i.id === itemId);
        if (itemIndex === -1) {
          return NextResponse.json(
            { success: false, error: 'Item not found' },
            { status: 404 }
          );
        }
        category.items.splice(itemIndex, 1);
        return NextResponse.json({
          success: true,
          message: 'Item deleted',
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete' },
      { status: 500 }
    );
  }
}
