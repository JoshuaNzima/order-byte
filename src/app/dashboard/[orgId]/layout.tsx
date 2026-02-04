import Link from 'next/link';
import { organizations } from '@/data/sample-data';
import type { ReactNode } from 'react';

export default async function OrgDashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const organization = organizations.find((org) => org.id === orgId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xl font-semibold text-gray-900">{organization?.name ?? 'Dashboard'}</div>
            <div className="text-sm text-gray-600">Tenant: {orgId}</div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Switch tenant
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-white border border-gray-200 rounded-xl p-4 h-fit">
            <nav className="space-y-1">
              <NavLink href={`/dashboard/${orgId}/admin`} label="Admin" />
              <NavLink href={`/dashboard/${orgId}/manager`} label="Manager" />
              <NavLink href={`/dashboard/${orgId}/chef`} label="Chef" />
              <NavLink href={`/dashboard/${orgId}/barman`} label="Barman" />
              <NavLink href={`/dashboard/${orgId}/reception`} label="Reception" />
              <NavLink href={`/dashboard/${orgId}/waiter`} label="Waiter/Waitress" />
            </nav>
          </aside>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
    >
      {label}
    </Link>
  );
}
