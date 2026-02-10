import { redirect } from 'next/navigation';
import { decodeQRData, getSubdomainUrl } from '@/shared/utils/qr';
import LandingPage from '@/frontend/components/LandingPage';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const qr = resolvedSearchParams.qr;
  const org = resolvedSearchParams.org;
  const table = resolvedSearchParams.table;

  // Handle QR code scanning - redirect to subdomain-based menu
  if (typeof qr === 'string' && qr.length > 0) {
    const qrData = decodeQRData(qr);
    
    if (qrData) {
      // Build redirect URL with table info
      const tableNum = typeof table === 'string' ? table : qrData.tableNumber;
      const targetUrl = new URL(getSubdomainUrl(qrData.organizationId, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
      targetUrl.searchParams.set('qr', qr);
      targetUrl.searchParams.set('table', tableNum);
      
      redirect(targetUrl.toString());
    }
  }

  // Legacy org param redirect to subdomain
  if (typeof org === 'string' && org.length > 0) {
    const targetUrl = new URL(getSubdomainUrl(org, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    if (typeof table === 'string') {
      targetUrl.searchParams.set('table', table);
    }
    redirect(targetUrl.toString());
  }

  // Show landing page for root access
  return <LandingPage />;
}
