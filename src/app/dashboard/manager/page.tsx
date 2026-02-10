import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ManagerDashboardClient from './ManagerDashboardClient';

export default async function ManagerPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    redirect('/dashboard');
  }

  return <ManagerDashboardClient tenantId={tenantId} />;
}
