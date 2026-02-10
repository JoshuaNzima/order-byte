import MenuPageWrapper from '@/components/MenuPageWrapper';

export default async function MenuByOrgPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  return <MenuPageWrapper orgId={orgId} />;
}
