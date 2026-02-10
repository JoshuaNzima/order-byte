import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import WaiterDashboardClient from './WaiterDashboardClient';

export default async function WaiterPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    redirect('/dashboard');
  }

  return <WaiterDashboardClient tenantId={tenantId} />;
}
