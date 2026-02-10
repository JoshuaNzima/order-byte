import { redirect } from 'next/navigation';

export default async function WaiterPageRedirect() {
  redirect('/dashboard/waiter');
}
