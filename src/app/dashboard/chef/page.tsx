import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ChefDashboardClient from './ChefDashboardClient';

export default async function ChefPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    redirect('/dashboard');
  }

  return <ChefDashboardClient tenantId={tenantId} />;
}
