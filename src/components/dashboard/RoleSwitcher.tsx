'use client';

import { useState } from 'react';
import { useRole, type StaffRole } from '@/context/RoleContext';

const roles: { id: StaffRole; label: string; color: string }[] = [
  { id: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'manager', label: 'Manager', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'chef', label: 'Chef', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'barman', label: 'Barman', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'reception', label: 'Reception', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { id: 'waiter', label: 'Waiter', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
];

export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [isOpen, setIsOpen] = useState(false);

  const currentRole = roles.find((r) => r.id === role) ?? roles[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${currentRole.color}`}
      >
        <span>Role: {currentRole.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
              Switch Role (Demo)
            </div>
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  role === r.id ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <span>{r.label}</span>
                {role === r.id && (
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
