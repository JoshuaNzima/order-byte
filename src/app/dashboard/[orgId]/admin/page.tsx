import { redirect } from 'next/navigation';

export default async function AdminPageRedirect() {
  redirect('/dashboard/admin');
}
