'use client';

import Link from 'next/link';
import type { OrganizationWithSettings } from '@/shared/types/superadmin';
import { getSubdomainUrl } from '@/shared/utils/qr';

interface OrganizationLandingPageProps {
  organization: OrganizationWithSettings;
}

export default function OrganizationLandingPage({ organization }: OrganizationLandingPageProps) {
  const menuUrl = typeof window !== 'undefined' 
    ? getSubdomainUrl(organization.id, window.location.origin)
    : '';

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}`;

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${organization.theme.primaryColor}15 0%, ${organization.theme.secondaryColor}15 50%, ${organization.theme.accentColor}10 100%)` 
      }}
    >
      {/* Header */}
      <header 
        className="text-white sticky top-0 z-50"
        style={{ backgroundColor: organization.theme.primaryColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: organization.theme.accentColor }}
              >
                {organization.name.charAt(0)}
              </div>
              <h1 className="text-2xl font-bold">{organization.name}</h1>
            </div>
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              Powered by OrderByte
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            background: `linear-gradient(135deg, ${organization.theme.primaryColor} 0%, ${organization.theme.accentColor} 100%)` 
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ color: organization.theme.primaryColor }}
            >
              Welcome to {organization.name}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Scan the QR code to view our menu and place your order directly from your table
            </p>
            
            {/* QR Code */}
            <div className="flex justify-center mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-xl">
                <img 
                  src={qrCodeUrl} 
                  alt={`${organization.name} Menu QR Code`}
                  className="w-64 h-64"
                />
                <p className="text-sm text-gray-500 mt-4">Scan to view menu</p>
              </div>
            </div>

            {/* Menu Link Button */}
            <a
              href={menuUrl}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-transform hover:scale-105 shadow-lg"
              style={{ backgroundColor: organization.theme.accentColor }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              View Menu & Order
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600">Simple, fast, and contactless ordering</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${organization.theme.primaryColor}20` }}
              >
                <svg className="w-8 h-8" fill="none" stroke={organization.theme.primaryColor} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">1. Scan QR Code</h4>
              <p className="text-gray-600">Use your phone camera to scan the QR code at your table</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${organization.theme.accentColor}20` }}
              >
                <svg className="w-8 h-8" fill="none" stroke={organization.theme.accentColor} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9H19M7 13v8a2 2 0 002 2h8a2 2 0 002-2v-8m-9 4h4" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">2. Browse & Order</h4>
              <p className="text-gray-600">Explore our full menu and add items to your cart</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${organization.theme.secondaryColor}20` }}
              >
                <svg className="w-8 h-8" fill="none" stroke={organization.theme.secondaryColor} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">3. Enjoy!</h4>
              <p className="text-gray-600">Sit back and relax while we prepare your order</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      {(organization.contact.phone || organization.contact.website) && (
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="rounded-2xl p-8 text-center"
              style={{ backgroundColor: organization.theme.primaryColor }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              <div className="flex flex-wrap justify-center gap-6">
                {organization.contact.phone && (
                  <a 
                    href={`tel:${organization.contact.phone}`}
                    className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {organization.contact.phone}
                  </a>
                )}
                {organization.contact.website && (
                  <a 
                    href={organization.contact.website.startsWith('http') ? organization.contact.website : `https://${organization.contact.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    {organization.contact.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {organization.name}. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Digital menu powered by OrderByte
          </p>
        </div>
      </footer>
    </div>
  );
}
