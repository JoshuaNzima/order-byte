'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Session {
  userId: string;
  email: string;
  role: string;
  organizationId?: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'chef' | 'waiter' | 'barman';
  phone?: string;
  isActive: boolean;
}

export default function StaffPage({ tenantId }: { tenantId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: '1', name: 'John Manager', email: 'john@example.com', role: 'manager', phone: '+1234567890', isActive: true },
    { id: '2', name: 'Jane Chef', email: 'jane@example.com', role: 'chef', phone: '+1234567891', isActive: true },
    { id: '3', name: 'Mike Waiter', email: 'mike@example.com', role: 'waiter', isActive: true },
    { id: '4', name: 'Sarah Barman', email: 'sarah@example.com', role: 'barman', isActive: false },
  ]);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({ name: '', email: '', role: 'staff', isActive: true });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = (await response.json()) as { success: boolean; session?: Session };

      if (!data.success || !['admin', 'manager', 'superadmin'].includes(data.session?.role || '')) {
        router.push('/login/staff');
        return;
      }

      setSession(data.session || null);
    } catch {
      router.push('/login/staff');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login/staff');
  };

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.email) {
      setStaff([...staff, { ...newStaff, id: Date.now().toString() } as StaffMember]);
      setNewStaff({ name: '', email: '', role: 'staff', isActive: true });
      setShowAddForm(false);
    }
  };

  const handleUpdateStaff = (member: StaffMember) => {
    setStaff(staff.map((s) => (s.id === member.id ? member : s)));
    setEditingStaff(null);
  };

  const handleDeleteStaff = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  const toggleActive = (id: string) => {
    setStaff(staff.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      staff: 'bg-gray-100 text-gray-800',
      chef: 'bg-orange-100 text-orange-800',
      waiter: 'bg-green-100 text-green-800',
      barman: 'bg-yellow-100 text-yellow-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">{session?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
          <aside className="space-y-2">
            <NavLink href="/dashboard/admin" label="Overview" icon="dashboard" />
            <NavLink href="/dashboard/admin/orders" label="Orders" icon="orders" />
            <NavLink href="/dashboard/admin/menu" label="Menu" icon="menu" />
            <NavLink href="/dashboard/admin/staff" label="Staff" icon="staff" active />
            <NavLink href="/dashboard/admin/settings" label="Settings" icon="settings" />
          </aside>

          <main className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
                <p className="text-gray-600 mt-1">Manage your team members</p>
              </div>
              <Button onClick={() => setShowAddForm(true)} size="sm">
                + Add Staff
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{staff.length}</div>
                <div className="text-sm text-gray-600">Total Staff</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{staff.filter(s => s.isActive).length}</div>
                <div className="text-sm text-gray-600">Active</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{staff.filter(s => s.role === 'manager').length}</div>
                <div className="text-sm text-gray-600">Managers</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{staff.filter(s => ['chef', 'waiter', 'barman'].includes(s.role)).length}</div>
                <div className="text-sm text-gray-600">Service Staff</div>
              </Card>
            </div>

            {/* Add Staff Form */}
            {showAddForm && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Add New Staff Member</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as StaffMember['role'] })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="chef">Chef</option>
                    <option value="waiter">Waiter</option>
                    <option value="barman">Barman</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Phone (optional)"
                    value={newStaff.phone || ''}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddStaff}>Save Staff</Button>
                  <Button variant="secondary" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </Card>
            )}

            {/* Staff List */}
            <div className="space-y-4">
              {staff.map((member) => (
                <Card key={member.id} className="p-4">
                  {editingStaff?.id === member.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editingStaff.name}
                        onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="email"
                        value={editingStaff.email}
                        onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <select
                        value={editingStaff.role}
                        onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as StaffMember['role'] })}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="staff">Staff</option>
                        <option value="manager">Manager</option>
                        <option value="chef">Chef</option>
                        <option value="waiter">Waiter</option>
                        <option value="barman">Barman</option>
                      </select>
                      <input
                        type="text"
                        value={editingStaff.phone || ''}
                        onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="flex gap-2 md:col-span-2">
                        <Button size="sm" onClick={() => handleUpdateStaff(editingStaff)}>Save</Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingStaff(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(member.role)}`}>
                            {member.role}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        {member.phone && <p className="text-sm text-gray-400">{member.phone}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(member.id)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${member.isActive ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        >
                          {member.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => setEditingStaff(member)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(member.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function NavLink({ href, label, icon, active }: { href: string; label: string; icon: string; active?: boolean }) {
  const icons: Record<string, ReactNode> = {
    dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    orders: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    menu: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    staff: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  };

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'text-gray-700 hover:bg-gray-50 border border-transparent hover:border-gray-200'
      }`}
    >
      {icons[icon]}
      {label}
    </Link>
  );
}
