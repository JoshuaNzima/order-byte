import Link from 'next/link';
import { organizations } from '@/data/sample-data';
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { DashboardClientWrapper } from '@/components/dashboard/DashboardClientWrapper';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const tenantId = (await headers()).get('x-tenant-id');
  const organization = organizations.find((org) => org.id === tenantId);

  return (
    <DashboardClientWrapper
      orgName={organization?.name ?? 'Dashboard'}
      tenantId={tenantId}
      accentColor={organization?.theme.accentColor}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="bg-white border border-gray-200 rounded-xl p-4 h-fit">
          <nav className="space-y-1">
            <NavLink href="/dashboard/admin" label="Admin" />
            <NavLink href="/dashboard/manager" label="Manager" />
            <NavLink href="/dashboard/chef" label="Chef" />
            <NavLink href="/dashboard/barman" label="Barman" />
            <NavLink href="/dashboard/reception" label="Reception" />
            <NavLink href="/dashboard/waiter" label="Waiter/Waitress" />
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </DashboardClientWrapper>
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
