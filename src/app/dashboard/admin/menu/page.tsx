import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import MenuClient from './MenuClient';

export default async function MenuServerPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    redirect('/dashboard');
  }

  return <MenuClient tenantId={tenantId} />;
}
