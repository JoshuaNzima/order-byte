import { redirect } from 'next/navigation';

export default async function ChefPageRedirect() {
  redirect('/dashboard/chef');
}
