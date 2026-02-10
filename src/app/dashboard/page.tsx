import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardIndexPage() {
  const tenantId = (await headers()).get('x-tenant-id');

  if (!tenantId) {
    // Show tenant chooser if no subdomain detected
    return <TenantChooser />;
  }

  redirect('/dashboard/admin');
}

function TenantChooser() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Select Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Access your dashboard via your organization subdomain, or select below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="http://bella-vista.localhost:5000/dashboard"
            className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="text-xl font-semibold text-gray-900">Bella Vista Restaurant</div>
            <div className="text-sm text-gray-600 mt-1">bella-vista.localhost:5000</div>
          </a>

          <a
            href="http://urban-cafe.localhost:5000/dashboard"
            className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="text-xl font-semibold text-gray-900">Urban Café</div>
            <div className="text-sm text-gray-600 mt-1">urban-cafe.localhost:5000</div>
          </a>
        </div>
      </div>
    </div>
  );
}
