import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import StaffClient from './StaffClient';

export default async function StaffServerPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    redirect('/dashboard');
  }

  return <StaffClient tenantId={tenantId} />;
}
