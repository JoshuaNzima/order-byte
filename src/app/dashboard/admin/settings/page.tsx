import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function SettingsServerPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    redirect('/dashboard');
  }

  return <SettingsClient tenantId={tenantId} />;
}
