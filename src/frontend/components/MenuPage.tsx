'use client';

import { useSearchParams } from 'next/navigation';
import { organizations, menus } from '@/backend/data/seed-data';
import { CartProvider } from '@/context/CartContext';
import MenuHeader from '@/components/MenuHeader';
import MenuCategory from '@/components/MenuCategory';
import Cart from '@/components/Cart';
import Link from 'next/link';

interface MenuPageProps {
  orgId?: string;
  tenantId?: string;
}

export default function MenuPage({ orgId, tenantId }: MenuPageProps) {
  const searchParams = useSearchParams();
  const resolvedOrgId = orgId ?? tenantId ?? searchParams.get('org');
  const tableNumber = searchParams.get('table');
  
  // If no organization resolved, show error with link to home
  if (!resolvedOrgId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to OrderByte</h1>
          <p className="text-gray-600 mb-6">
            Please scan the QR code at your table to access the menu, or visit our homepage.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Go to Homepage
            </Link>
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700 font-medium text-center"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Find the organization and menu
  const organization = organizations.find(org => org.id === resolvedOrgId);
  const menu = menus.find(m => m.organizationId === resolvedOrgId && m.isActive);

  if (!organization || !menu) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Menu Not Found</h1>
          <p className="text-gray-600 mb-4">
            The requested menu could not be found. Please check your QR code or contact the restaurant.
          </p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Table indicator if from QR scan */}
        {tableNumber && (
          <div className="bg-blue-600 text-white py-2 px-4 text-center">
            <p className="text-sm font-medium">
              Table {tableNumber} • {organization.name}
            </p>
          </div>
        )}
        
        <MenuHeader organization={organization} />
        
        <main className="container mx-auto px-4 py-6 max-w-2xl pb-24">
          {menu.description && (
            <div className="mb-8 text-center bg-white p-4 rounded-xl shadow-sm">
              <p className="text-gray-700 italic">{menu.description}</p>
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
          
          <div className="mt-12 pt-6 border-t border-gray-200 text-center bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">
              Last updated: {menu.lastUpdated.toLocaleDateString()}
            </p>
            {tableNumber && (
              <p className="text-xs text-gray-400 mt-1">
                Ordering for Table {tableNumber}
              </p>
            )}
          </div>
        </main>

        <Cart 
          accentColor={organization.theme.accentColor}
          organizationId={resolvedOrgId}
          organizationName={organization.name}
          tableNumber={tableNumber ?? undefined}
        />
      </div>
    </CartProvider>
  );
}
