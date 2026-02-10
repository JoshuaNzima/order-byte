import { redirect } from 'next/navigation';

export default async function ManagerPageRedirect() {
  redirect('/dashboard/manager');
}
