import { redirect } from 'next/navigation';

export default async function OrgDashboardIndexPage() {
  redirect('/dashboard/admin');
}
