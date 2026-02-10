export interface QRData {
  organizationId: string;
  tableNumber: string;
  timestamp: number;
  signature?: string;
}

export function encodeQRData(data: QRData): string {
  return btoa(JSON.stringify(data));
}

export function decodeQRData(encoded: string): QRData | null {
  try {
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

export function generateQRUrl(organizationId: string, tableNumber: string, baseUrl?: string): string {
  const origin = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const qrData: QRData = {
    organizationId,
    tableNumber,
    timestamp: Date.now()
  };
  const encoded = encodeQRData(qrData);
  
  // Generate subdomain-based URL for customer access
  // e.g., https://bella-vista.orderbyte.app/?table=12&qr=encoded
  const url = new URL(origin);
  const hostname = url.hostname;
  const protocol = url.protocol;
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${origin}/?qr=${encoded}&table=${tableNumber}`;
  }
  
  // Production: use subdomain
  const domainParts = hostname.split('.');
  if (domainParts.length >= 2) {
    const rootDomain = domainParts.slice(-2).join('.');
    return `${protocol}//${organizationId}.${rootDomain}/?qr=${encoded}&table=${tableNumber}`;
  }
  
  return `${origin}/?qr=${encoded}&table=${tableNumber}`;
}

export function getSubdomainUrl(organizationId: string, baseUrl?: string): string {
  const origin = baseUrl ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const url = new URL(origin);
  const hostname = url.hostname;
  const protocol = url.protocol;
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${origin}/menu/${organizationId}`;
  }
  
  // Production: use subdomain
  const domainParts = hostname.split('.');
  if (domainParts.length >= 2) {
    const rootDomain = domainParts.slice(-2).join('.');
    return `${protocol}//${organizationId}.${rootDomain}`;
  }
  
  return `${origin}/menu/${organizationId}`;
}
