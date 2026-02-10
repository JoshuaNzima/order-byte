'use client';

import { Suspense } from 'react';
import MenuPage from './MenuPage';

function MenuPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading menu...</p>
      </div>
    </div>
  );
}

export default function MenuPageWrapper({ orgId }: { orgId?: string }) {
  return (
    <Suspense fallback={<MenuPageFallback />}>
      <MenuPage orgId={orgId} />
    </Suspense>
  );
}