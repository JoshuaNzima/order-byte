import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import BarmanDashboardClient from './BarmanDashboardClient';

export default async function BarmanPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    redirect('/dashboard');
  }

  return <BarmanDashboardClient tenantId={tenantId} />;
}
