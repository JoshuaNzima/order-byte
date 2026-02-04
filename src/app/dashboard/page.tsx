import Link from 'next/link';
import { organizations } from '@/data/sample-data';
import Card from '@/components/ui/Card';

const roles: Array<{ id: string; label: string }> = [
  { id: 'admin', label: 'Admin' },
  { id: 'manager', label: 'Manager' },
  { id: 'chef', label: 'Chef' },
  { id: 'barman', label: 'Barman' },
  { id: 'reception', label: 'Reception' },
  { id: 'waiter', label: 'Waiter/Waitress' },
];

export default function DashboardIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboards</h1>
          <p className="text-gray-600 mt-1">Select a tenant and role</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organizations.map((org) => (
            <Card key={org.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold text-gray-900">{org.name}</div>
                  <div className="text-sm text-gray-600">Tenant: {org.id}</div>
                </div>
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: org.theme.accentColor }}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {roles.map((role) => (
                  <Link
                    key={role.id}
                    href={`/dashboard/${org.id}/${role.id}`}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {role.label}
                  </Link>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
