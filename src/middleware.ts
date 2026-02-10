import { NextRequest, NextResponse } from 'next/server';

function getTenantFromHost(host: string | null): string | null {
  if (!host) return null;

  const hostname = host.split(':')[0] ?? host;

  if (hostname === 'localhost' || hostname === '127.0.0.1') return null;

  if (hostname.endsWith('.localhost')) {
    const tenant = hostname.slice(0, -'.localhost'.length);
    return tenant && tenant !== 'www' ? tenant : null;
  }

  const parts = hostname.split('.').filter(Boolean);
  if (parts.length < 2) return null;

  const subdomain = parts[0];
  if (!subdomain || subdomain === 'www') return null;

  return subdomain;
}

export function middleware(request: NextRequest) {
  const tenantId = getTenantFromHost(request.headers.get('host'));

  const requestHeaders = new Headers(request.headers);
  if (tenantId) {
    requestHeaders.set('x-tenant-id', tenantId);
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  const existingClientId = request.cookies.get('ob_client_id')?.value;
  if (!existingClientId) {
    response.cookies.set({
      name: 'ob_client_id',
      value: crypto.randomUUID(),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
