'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { OrganizationWithSettings, OrganizationSettings } from '@/shared/types/superadmin';

type Currency = OrganizationSettings['currency'];

export default function EditOrganizationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<OrganizationWithSettings | null>(null);

  useEffect(() => {
    fetchOrganization();
  }, [params.id]);

  async function fetchOrganization() {
    try {
      const response = await fetch(`/api/superadmin/organizations`, {
        headers: {
          'Authorization': 'Bearer superadmin-demo-token'
        }
      });
      const data = (await response.json()) as { success: boolean; organizations?: OrganizationWithSettings[]; error?: string };

      if (data.success && data.organizations) {
        const org = data.organizations.find(o => o.id === params.id);
        if (org) {
          setFormData(org);
        } else {
          setError('Organization not found');
        }
      } else {
        setError(data.error || 'Failed to fetch organization');
      }
    } catch {
      setError('Failed to fetch organization');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/superadmin/organizations/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer superadmin-demo-token',
        },
        body: JSON.stringify({
          name: formData.name,
          theme: formData.theme,
          contact: formData.contact,
          settings: formData.settings,
          isActive: formData.isActive,
        }),
      });

      const data = (await response.json()) as { success: boolean; error?: string };

      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to update organization');
      }
    } catch {
      setError('Failed to update organization');
    } finally {
      setSaving(false);
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
        <Link href="/superadmin/organizations" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Back to Organizations
        </Link>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/superadmin/organizations" className="text-gray-600 hover:text-gray-900">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Organization</h1>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-600">Organization updated successfully!</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
              <input
                type="text"
                value={formData.id}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">ID cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Organization is active</span>
            </label>
          </div>
        </div>

        {/* Theme Colors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Theme Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.theme.primaryColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    theme: { ...formData.theme, primaryColor: e.target.value },
                  })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.theme.primaryColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    theme: { ...formData.theme, primaryColor: e.target.value },
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.theme.secondaryColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    theme: { ...formData.theme, secondaryColor: e.target.value },
                  })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.theme.secondaryColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    theme: { ...formData.theme, secondaryColor: e.target.value },
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.theme.accentColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    theme: { ...formData.theme, accentColor: e.target.value },
                  })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.theme.accentColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    theme: { ...formData.theme, accentColor: e.target.value },
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.contact.phone || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={formData.contact.website || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, website: e.target.value },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="www.example.com"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={formData.settings.currency}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: { ...formData.settings, currency: e.target.value as Currency },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MWK">MWK (Malawian Kwacha)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.settings.taxRate}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: { ...formData.settings, taxRate: parseFloat(e.target.value) || 0 },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Charge (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.settings.serviceCharge}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: { ...formData.settings, serviceCharge: parseFloat(e.target.value) || 0 },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QR Code Expiry (minutes)</label>
              <input
                type="number"
                min="1"
                max="1440"
                value={formData.settings.qrCodeExpiryMinutes}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: { ...formData.settings, qrCodeExpiryMinutes: parseInt(e.target.value) || 60 },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.settings.allowTips}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: { ...formData.settings, allowTips: e.target.checked },
                })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Allow tips</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.settings.requireTableNumber}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: { ...formData.settings, requireTableNumber: e.target.checked },
                })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Require table number</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.settings.enableOnlinePayment}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: { ...formData.settings, enableOnlinePayment: e.target.checked },
                })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Enable online payment</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/superadmin/organizations"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
