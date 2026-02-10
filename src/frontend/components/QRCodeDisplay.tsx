'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

interface QRCodeProps {
  url: string;
  size?: number;
  orgName?: string;
  primaryColor?: string;
}

export default function QRCodeDisplay({ 
  url, 
  size = 256, 
  orgName = 'Menu',
  primaryColor = '#2d3748'
}: QRCodeProps) {
  const [downloaded, setDownloaded] = useState(false);

  function downloadQRCode() {
    const svg = document.getElementById('organization-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size + 40;
      canvas.height = size + 80;
      
      // Fill white background
      ctx!.fillStyle = 'white';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code
      ctx!.drawImage(img, 20, 20);
      
      // Add text
      ctx!.fillStyle = primaryColor;
      ctx!.font = 'bold 16px sans-serif';
      ctx!.textAlign = 'center';
      ctx!.fillText(`Scan for ${orgName} Menu`, canvas.width / 2, size + 60);

      // Download
      const link = document.createElement('a');
      link.download = `${orgName.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <QRCodeSVG
          id="organization-qr-code"
          value={url}
          size={size}
          level="H"
          includeMargin={false}
          style={{ display: 'block' }}
        />
        <p className="text-sm text-gray-500 text-center mt-3">
          Scan to view menu
        </p>
      </div>
      
      <button
        onClick={downloadQRCode}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {downloaded ? 'Downloaded!' : 'Download QR Code'}
      </button>
    </div>
  );
}
