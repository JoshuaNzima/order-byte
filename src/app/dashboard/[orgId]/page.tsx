import { redirect } from 'next/navigation';

export default async function OrgDashboardIndexPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  redirect(`/dashboard/${orgId}/admin`);
}
