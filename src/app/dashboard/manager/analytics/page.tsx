import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsServerPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    redirect('/dashboard');
  }

  return <AnalyticsClient tenantId={tenantId} />;
}
