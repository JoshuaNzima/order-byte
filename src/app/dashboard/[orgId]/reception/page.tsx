import { redirect } from 'next/navigation';

export default async function ReceptionPageRedirect() {
  redirect('/dashboard/reception');
}
