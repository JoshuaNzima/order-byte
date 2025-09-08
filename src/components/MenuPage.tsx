'use client';

import { useSearchParams } from 'next/navigation';
import { organizations, menus } from '@/data/sample-data';
import { CartProvider } from '@/context/CartContext';
import MenuHeader from '@/components/MenuHeader';
import MenuCategory from '@/components/MenuCategory';
import Cart from '@/components/Cart';

export default function MenuPage() {
  const searchParams = useSearchParams();
  const orgId = searchParams.get('org');
  
  // If no org parameter, show landing page
  if (!orgId) {
    return <LandingPage />;
  }

  // Find the organization and menu
  const organization = organizations.find(org => org.id === orgId);
  const menu = menus.find(m => m.organizationId === orgId && m.isActive);

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
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
          </div>
        </main>

        <Cart 
          accentColor={organization.theme.accentColor}
          organizationName={organization.name}
        />
      </div>
    </CartProvider>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              OrderByte
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The future of dining is here. Scan, browse, and order directly from your table with our beautiful digital menu system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => window.location.href = '/?org=bella-vista'}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Try Demo - Bella Vista
              </button>
              <button 
                onClick={() => window.location.href = '/?org=urban-cafe'}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Try Demo - Urban Café
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why OrderByte?</h2>
            <p className="text-xl text-gray-600">Modern dining experiences for the digital age</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Mobile First</h3>
              <p className="text-gray-600">Optimized for smartphones and tablets. Beautiful, responsive design that works on any device.</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9H19M7 13v8a2 2 0 002 2h8a2 2 0 002-2v-8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Easy Ordering</h3>
              <p className="text-gray-600">No apps to download. No accounts to create. Just scan, order, and enjoy.</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Multi-Restaurant</h3>
              <p className="text-gray-600">Perfect for restaurants, cafés, bars, and any hospitality business. Fully customizable branding.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to transform your restaurant?</h3>
          <p className="text-gray-400 mb-8">Join the digital revolution in hospitality</p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Get Started
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}