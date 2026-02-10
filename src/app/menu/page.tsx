import { headers } from 'next/headers';
import MenuPageWrapper from '@/components/MenuPageWrapper';

export default async function MenuRootPage() {
  const tenantId = (await headers()).get('x-tenant-id') ?? undefined;
  return <MenuPageWrapper orgId={tenantId} />;
}
