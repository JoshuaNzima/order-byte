'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { OrganizationWithSettings } from '@/shared/types/superadmin';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<OrganizationWithSettings[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<OrganizationWithSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('name');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    filterOrganizations();
  }, [organizations, searchQuery, statusFilter, sortBy]);

  async function fetchOrganizations() {
    try {
      const response = await fetch('/api/superadmin/organizations', {
        headers: {
          'Authorization': 'Bearer superadmin-demo-token'
        }
      });
      const data = (await response.json()) as { success: boolean; organizations?: OrganizationWithSettings[]; error?: string };

      if (data.success && data.organizations) {
        setOrganizations(data.organizations);
      } else {
        setError(data.error || 'Failed to fetch organizations');
      }
    } catch {
      setError('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  }

  function filterOrganizations() {
    let filtered = [...organizations];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(query) ||
        org.id.toLowerCase().includes(query) ||
        (org.contact.phone && org.contact.phone.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(org =>
        statusFilter === 'active' ? org.isActive : !org.isActive
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredOrgs(filtered);
  }

  async function deleteOrganization(id: string) {
    if (!confirm('Are you sure you want to delete this organization?')) return;

    try {
      const response = await fetch(`/api/superadmin/organizations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer superadmin-demo-token'
        }
      });

      const data = (await response.json()) as { success: boolean; error?: string };

      if (data.success) {
        setOrganizations(organizations.filter(org => org.id !== id));
      } else {
        alert(data.error || 'Failed to delete organization');
      }
    } catch {
      alert('Failed to delete organization');
    }
  }

  async function toggleOrganizationStatus(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/superadmin/organizations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer superadmin-demo-token'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = (await response.json()) as { success: boolean; organization?: OrganizationWithSettings; error?: string };

      if (data.success && data.organization) {
        setOrganizations(organizations.map(org =>
          org.id === id ? data.organization! : org
        ));
      } else {
        alert(data.error || 'Failed to update organization');
      }
    } catch {
      alert('Failed to update organization');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const activeCount = organizations.filter(org => org.isActive).length;
  const inactiveCount = organizations.length - activeCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-500 mt-1">Manage all restaurants and venues</p>
        </div>
        <Link
          href="/superadmin/organizations/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span>
          <span>Add Organization</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{organizations.length}</div>
          <div className="text-sm text-gray-500">Total Organizations</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          <div className="text-sm text-gray-500">Active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{inactiveCount}</div>
          <div className="text-sm text-gray-500">Inactive</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'created' | 'updated')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="created">Sort by Created</option>
              <option value="updated">Sort by Updated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Settings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landing Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrgs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? 'No organizations match your search.' : 'No organizations found. Create your first one!'}
                  </td>
                </tr>
              ) : (
                filteredOrgs.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: org.theme.primaryColor }}
                        >
                          {org.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{org.name}</div>
                          <div className="text-sm text-gray-500">ID: {org.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleOrganizationStatus(org.id, org.isActive)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          org.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {org.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-col gap-1">
                        <span>{org.settings.currency}</span>
                        <span>Tax: {org.settings.taxRate}%</span>
                        <span>Tips: {org.settings.allowTips ? 'Yes' : 'No'}</span>
                        <span>Payment: {org.settings.enableOnlinePayment ? 'Online' : 'Cash'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {org.contact.phone || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/superadmin/organizations/${org.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm px-2 py-1 hover:bg-blue-50 rounded"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteOrganization(org.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm px-2 py-1 hover:bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/org/${org.id}`}
                        target="_blank"
                        className="text-purple-600 hover:text-purple-800 font-medium text-sm px-2 py-1 hover:bg-purple-50 rounded flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            Showing {filteredOrgs.length} of {organizations.length} organizations
          </p>
        </div>
      </div>
    </div>
  );
}
