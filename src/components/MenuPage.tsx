'use client';

import { useSearchParams } from 'next/navigation';
import { organizations, menus } from '@/data/sample-data';
import MenuHeader from '@/components/MenuHeader';
import MenuCategory from '@/components/MenuCategory';

export default function MenuPage() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get('org') || 'bella-vista'; // Default to bella-vista

  // Find the organization and menu
  const organization = organizations.find(org => org.id === orgId);
  const menu = menus.find(m => m.organizationId === orgId && m.isActive);

  if (!organization || !menu) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Not Found</h1>
          <p className="text-gray-600">
            The requested menu could not be found. Please check your QR code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuHeader organization={organization} />
      
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {menu.description && (
          <div className="mb-8 text-center">
            <p className="text-gray-600">{menu.description}</p>
          </div>
        )}
        
        {menu.categories
          .sort((a, b) => a.order - b.order)
          .map((category) => (
            <MenuCategory
              key={category.id}
              category={category}
              accentColor={organization.theme.accentColor}
            />
          ))}
        
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {menu.lastUpdated.toLocaleDateString()}
          </p>
        </div>
      </main>
    </div>
  );
}