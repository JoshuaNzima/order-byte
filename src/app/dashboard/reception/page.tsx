import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ReceptionDashboardClient from './ReceptionDashboardClient';

export default async function ReceptionPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    redirect('/dashboard');
  }

  return <ReceptionDashboardClient tenantId={tenantId} />;
}
