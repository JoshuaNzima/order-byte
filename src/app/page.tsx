import { redirect } from 'next/navigation';
import MenuPageWrapper from '@/components/MenuPageWrapper';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const org = resolvedSearchParams.org;

  if (typeof org === 'string' && org.length > 0) {
    redirect(`/menu/${org}`);
  }

  return <MenuPageWrapper />;
}
