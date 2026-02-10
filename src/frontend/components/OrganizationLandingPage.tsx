'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { OrganizationWithSettings } from '@/shared/types/superadmin';
import { getSubdomainUrl } from '@/shared/utils/qr';
import QRCodeDisplay from './QRCodeDisplay';

interface OrganizationLandingPageProps {
  organization: OrganizationWithSettings;
}

export default function OrganizationLandingPage({ organization }: OrganizationLandingPageProps) {
  const [menuUrl, setMenuUrl] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMenuUrl(getSubdomainUrl(organization.id, window.location.origin));
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [organization.id]);

  if (!menuUrl) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Floating Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-lg shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ backgroundColor: organization.theme.primaryColor }}
              >
                {organization.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{organization.name}</h1>
                <p className="text-xs text-gray-500">Digital Menu</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#menu" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Menu
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                How It Works
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/login/staff"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Staff Login
              </Link>
              <Link
                href="/login/superadmin"
                className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: organization.theme.accentColor }}
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="menu" className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Decorations */}
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{ backgroundColor: organization.theme.primaryColor }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: organization.theme.accentColor }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{ backgroundColor: `${organization.theme.primaryColor}15`, color: organization.theme.primaryColor }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: organization.theme.primaryColor }} />
                Scan & Order Instantly
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to{' '}
                <span style={{ color: organization.theme.primaryColor }}>
                  {organization.name}
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
                Experience hassle-free dining. Scan our QR code to browse the menu, 
                customize your order, and pay directly from your phone.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href={menuUrl}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:shadow-xl hover:scale-105"
                  style={{ backgroundColor: organization.theme.accentColor }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  View Menu & Order
                </a>
                
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-lg border-2"
                  style={{ borderColor: organization.theme.primaryColor, color: organization.theme.primaryColor }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How It Works
                </a>
              </div>
            </div>

            {/* Right Content - QR Code Card */}
            <div className="flex justify-center lg:justify-end">
              <div 
                className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full"
                style={{ boxShadow: `0 25px 50px -12px ${organization.theme.primaryColor}25` }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan to Order</h3>
                  <p className="text-sm text-gray-500">Point your camera at the code</p>
                </div>
                
                <div className="flex justify-center mb-6">
                  <div 
                    className="p-4 rounded-2xl"
                    style={{ backgroundColor: `${organization.theme.primaryColor}08` }}
                  >
                    <QRCodeDisplay 
                      url={menuUrl}
                      size={220}
                      orgName={organization.name}
                      primaryColor={organization.theme.primaryColor}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure & Contactless
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span 
              className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4"
              style={{ backgroundColor: `${organization.theme.accentColor}15`, color: organization.theme.accentColor }}
            >
              Simple Process
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Order from your table in three simple steps. No app download needed!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div 
              className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-0.5 -translate-y-1/2"
              style={{ backgroundColor: `${organization.theme.primaryColor}20` }}
            />
            
            {/* Step 1 */}
            <div className="relative group">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg"
                  style={{ backgroundColor: organization.theme.primaryColor }}
                >
                  1
                </div>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${organization.theme.primaryColor}10` }}>
                  <svg className="w-8 h-8" fill="none" stroke={organization.theme.primaryColor} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Scan QR Code</h4>
                <p className="text-gray-600">Point your phone camera at the QR code on your table</p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative group">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg"
                  style={{ backgroundColor: organization.theme.accentColor }}
                >
                  2
                </div>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${organization.theme.accentColor}10` }}>
                  <svg className="w-8 h-8" fill="none" stroke={organization.theme.accentColor} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.8 9H19M7 13v8a2 2 0 002 2h8a2 2 0 002-2v-8m-9 4h4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Browse & Order</h4>
                <p className="text-gray-600">Explore our menu and add items to your cart</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative group">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl shadow-lg"
                  style={{ backgroundColor: organization.theme.secondaryColor }}
                >
                  3
                </div>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${organization.theme.secondaryColor}10` }}>
                  <svg className="w-8 h-8" fill="none" stroke={organization.theme.secondaryColor} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Enjoy!</h4>
                <p className="text-gray-600">Relax while we prepare your order and bring it to you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'No App Required', desc: 'Works directly in browser' },
              { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Save Time', desc: 'Order without waiting' },
              { icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', title: 'Easy Payment', desc: 'Multiple payment options' },
              { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', title: 'Special Offers', desc: 'Exclusive deals for you' },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: `${organization.theme.primaryColor}05` }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${organization.theme.primaryColor}15` }}
                >
                  <svg className="w-6 h-6" fill="none" stroke={organization.theme.primaryColor} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      {(organization.contact.phone || organization.contact.website) && (
        <section id="contact" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="rounded-3xl p-12 text-center relative overflow-hidden"
              style={{ backgroundColor: organization.theme.primaryColor }}
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative">
                <h3 className="text-3xl font-bold text-white mb-4">Get in Touch</h3>
                <p className="text-white/80 mb-8 max-w-xl mx-auto">
                  Have questions or special requests? We are here to help make your visit perfect.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  {organization.contact.phone && (
                    <a 
                      href={`tel:${organization.contact.phone}`}
                      className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
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
                      className="flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Staff CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Staff Member?</h3>
              <p className="text-gray-400">Access your organization dashboard to manage orders and settings.</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login/staff"
                className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Staff Login
              </Link>
              <Link
                href="/login/superadmin"
                className="px-6 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: organization.theme.accentColor }}
              >
                {organization.name.charAt(0)}
              </div>
              <span className="text-gray-300">
                © {new Date().getFullYear()} {organization.name}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-300 transition-colors">
                Home
              </Link>
              <Link href="/login/staff" className="hover:text-gray-300 transition-colors">
                Staff Login
              </Link>
              <Link href="/login/superadmin" className="hover:text-gray-300 transition-colors">
                Admin
              </Link>
              <span>Powered by OrderByte</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
