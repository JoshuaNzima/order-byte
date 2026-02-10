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
  return `${origin}/?qr=${encoded}`;
}
