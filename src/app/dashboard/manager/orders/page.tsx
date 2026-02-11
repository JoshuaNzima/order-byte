import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import OrdersClient from './OrdersClient';

export default async function OrdersServerPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    redirect('/dashboard');
  }

  return <OrdersClient tenantId={tenantId} />;
}
