import { redirect } from 'next/navigation';

export default async function BarmanPageRedirect() {
  redirect('/dashboard/barman');
}
